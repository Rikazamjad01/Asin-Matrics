import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ─── Environment Variables ────────────────────────────────────────────────────
const AMAZON_CLIENT_ID = Deno.env.get("AMAZON_CLIENT_ID")!
const AMAZON_CLIENT_SECRET = Deno.env.get("AMAZON_CLIENT_SECRET")!
const AMAZON_REFRESH_TOKEN = Deno.env.get("AMAZON_REFRESH_TOKEN")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const SP_API_BASE = "https://sellingpartnerapi-na.amazon.com"
const MARKETPLACE_US = "ATVPDKIKX0DER"

// ─── Helper: Refresh Access Token ─────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: AMAZON_REFRESH_TOKEN,
      client_id: AMAZON_CLIENT_ID,
      client_secret: AMAZON_CLIENT_SECRET,
    }),
  })

  const data = await res.json()

  if (!data.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  }

  return data.access_token
}

// ─── Helper: Sleep ────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Helper: Reports API 3-Step Flow ──────────────────────────────────────────
async function requestAndDownloadReport(
  accessToken: string,
  reportType: string,
  dataStartTime?: string,
  dataEndTime?: string
): Promise<string> {
  // Step 1: Request report
  const createBody: Record<string, unknown> = {
    reportType,
    marketplaceIds: [MARKETPLACE_US],
  }

  if (dataStartTime) createBody.dataStartTime = dataStartTime
  if (dataEndTime) createBody.dataEndTime = dataEndTime

  const createRes = await fetch(`${SP_API_BASE}/reports/2021-06-30/reports`, {
    method: "POST",
    headers: {
      "x-amz-access-token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createBody),
  })

  if (!createRes.ok) {
    const err = await createRes.text()

    throw new Error(`Report request failed: ${err}`)
  }

  const { reportId } = await createRes.json()

  // Step 2: Poll for completion (max 20 attempts, 15s apart = 5 min max)
  let reportDocumentId = ""

  for (let i = 0; i < 20; i++) {
    await sleep(15000)

    const statusRes = await fetch(`${SP_API_BASE}/reports/2021-06-30/reports/${reportId}`, {
      headers: { "x-amz-access-token": accessToken },
    })

    const statusData = await statusRes.json()

    if (statusData.processingStatus === "DONE") {
      reportDocumentId = statusData.reportDocumentId
      break
    }

    if (statusData.processingStatus === "CANCELLED" || statusData.processingStatus === "FATAL") {
      throw new Error(`Report ${reportType} failed: ${statusData.processingStatus}`)
    }
  }

  if (!reportDocumentId) {
    throw new Error(`Report ${reportType} timed out after 5 minutes`)
  }

  // Step 3: Download report document
  const docRes = await fetch(`${SP_API_BASE}/reports/2021-06-30/documents/${reportDocumentId}`, {
    headers: { "x-amz-access-token": accessToken },
  })

  const docData = await docRes.json()
  const downloadUrl = docData.url
  const compressionAlgorithm = docData.compressionAlgorithm

  const fileRes = await fetch(downloadUrl)

  if (compressionAlgorithm === "GZIP") {
    // Report is gzip compressed, use Deno's native DecompressionStream
    const ds = new DecompressionStream("gzip")
    const decompressedStream = fileRes.body!.pipeThrough(ds)
    const textData = await new Response(decompressedStream).text()


return textData
  }

  const content = await fileRes.text()

  return content
}

// ─── Helper: Parse TSV ────────────────────────────────────────────────────────
function parseTSV(tsv: string): Record<string, string>[] {
  const lines = tsv.trim().split("\n")

  if (lines.length < 2) return []

  const headers = lines[0].split("\t").map(h => h.trim())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t")
    const row: Record<string, string> = {}

    headers.forEach((h, j) => {
      row[h] = values[j]?.trim() ?? ""
    })

    rows.push(row)
  }

  return rows
}

// ─── Action: Sync FBA Inventory (Direct API) ─────────────────────────────────
async function syncInventory(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  const url = new URL(`${SP_API_BASE}/fba/inventory/v1/summaries`)

  url.searchParams.set("marketplaceIds", MARKETPLACE_US)
  url.searchParams.set("granularityType", "Marketplace")
  url.searchParams.set("granularityId", MARKETPLACE_US)

  const res = await fetch(url.toString(), {
    headers: {
      "x-amz-access-token": accessToken,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const errText = await res.text()

    throw new Error(`SP-API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const summaries = data?.payload?.inventorySummaries ?? []

  if (summaries.length === 0) {
    return { synced: 0, message: "No inventory data returned from Amazon" }
  }

  const rows = summaries.map((item: Record<string, unknown>) => ({
    asin: item.asin,
    fn_sku: item.fnSku || null,
    seller_sku: item.sellerSku || null,
    product_name: item.productName || null,
    condition: item.condition || null,
    total_quantity: item.totalQuantity ?? 0,
    last_updated_time: item.lastUpdatedTime || null,
    synced_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("fba_inventory")
    .upsert(rows, { onConflict: "asin,seller_sku" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} inventory items` }
}

// ─── Action: Sync Sales & Traffic Report ──────────────────────────────────────
async function syncSalesTraffic(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  // Get last 30 days of data
  const endDate = new Date()
  const startDate = new Date()

  startDate.setDate(startDate.getDate() - 30)

  const content = await requestAndDownloadReport(
    accessToken,
    "GET_SALES_AND_TRAFFIC_REPORT",
    startDate.toISOString(),
    endDate.toISOString()
  )

  // This report returns JSON
  const reportData = JSON.parse(content)
  const byAsin = reportData?.salesAndTrafficByAsin ?? []

  if (byAsin.length === 0) {
    return { synced: 0, message: "No sales/traffic data returned" }
  }

  const today = new Date().toISOString().split("T")[0]

  const rows = byAsin.map((item: Record<string, unknown>) => {
    const traffic = item.trafficByAsin as Record<string, unknown> || {}
    const sales = item.salesByAsin as Record<string, unknown> || {}
    const orderedSales = sales.orderedProductSales as Record<string, unknown> || {}
    const orderedSalesB2B = sales.orderedProductSalesB2B as Record<string, unknown> || {}

    return {
      report_date: today,
      asin: (item as Record<string, string>).parentAsin || (item as Record<string, string>).childAsin,
      parent_asin: (item as Record<string, string>).parentAsin || null,
      sessions: traffic.sessions ?? 0,
      session_percentage: traffic.sessionPercentage ?? 0,
      page_views: traffic.pageViews ?? 0,
      page_views_percentage: traffic.pageViewsPercentage ?? 0,
      buy_box_percentage: traffic.buyBoxPercentage ?? 0,
      units_ordered: sales.unitsOrdered ?? 0,
      units_ordered_b2b: sales.unitsOrderedB2B ?? 0,
      ordered_product_sales: orderedSales.amount ?? 0,
      ordered_product_sales_b2b: orderedSalesB2B.amount ?? 0,
      total_order_items: sales.totalOrderItems ?? 0,
      total_order_items_b2b: sales.totalOrderItemsB2B ?? 0,
      unit_session_percentage: traffic.unitSessionPercentage ?? 0,
      unit_session_percentage_b2b: traffic.unitSessionPercentageB2B ?? 0,
      synced_at: new Date().toISOString(),
    }
  })

  const { error } = await supabase
    .from("sales_traffic_report")
    .upsert(rows, { onConflict: "report_date,asin" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} sales/traffic records` }
}

// ─── Action: Sync FBA Inventory Detail (Report) ──────────────────────────────
async function syncInventoryDetail(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  const content = await requestAndDownloadReport(
    accessToken,
    "GET_FBA_MYI_ALL_INVENTORY_DATA"
  )

  const parsed = parseTSV(content)

  if (parsed.length === 0) {
    return { synced: 0, message: "No inventory detail data returned" }
  }

  const rows = parsed.map(item => ({
    sku: item["sku"] || item["seller-sku"] || "",
    fn_sku: item["fnsku"] || null,
    asin: item["asin"] || null,
    product_name: item["product-name"] || null,
    product_condition: item["condition"] || item["your-price"] ? "New" : null,
    your_price: parseFloat(item["your-price"]) || null,
    mfn_listing_exists: item["mfn-listing-exists"] || null,
    mfn_fulfillable_quantity: parseInt(item["mfn-fulfillable-quantity"]) || 0,
    afn_listing_exists: item["afn-listing-exists"] || null,
    afn_warehouse_quantity: parseInt(item["afn-warehouse-quantity"]) || 0,
    afn_fulfillable_quantity: parseInt(item["afn-fulfillable-quantity"]) || 0,
    afn_unsellable_quantity: parseInt(item["afn-unsellable-quantity"]) || 0,
    afn_reserved_quantity: parseInt(item["afn-reserved-quantity"]) || 0,
    afn_total_quantity: parseInt(item["afn-total-quantity"]) || 0,
    per_unit_volume: parseFloat(item["per-unit-volume"]) || null,
    afn_inbound_working_quantity: parseInt(item["afn-inbound-working-quantity"]) || 0,
    afn_inbound_shipped_quantity: parseInt(item["afn-inbound-shipped-quantity"]) || 0,
    afn_inbound_receiving_quantity: parseInt(item["afn-inbound-receiving-quantity"]) || 0,
    afn_researching_quantity: parseInt(item["afn-researching-quantity"]) || 0,
    afn_reserved_future_supply: parseInt(item["afn-reserved-future-supply"]) || 0,
    afn_future_supply_buyable: parseInt(item["afn-future-supply-buyable"]) || 0,
    synced_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("fba_inventory_detail")
    .upsert(rows, { onConflict: "sku" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} inventory detail records` }
}

// ─── Action: Sync Inventory Planning (Report) ────────────────────────────────
async function syncInventoryPlanning(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  const content = await requestAndDownloadReport(
    accessToken,
    "GET_FBA_INVENTORY_PLANNING_DATA"
  )

  const parsed = parseTSV(content)

  if (parsed.length === 0) {
    return { synced: 0, message: "No inventory planning data returned" }
  }

  const rows = parsed.map(item => ({
    snapshot_date: item["snapshot-date"] || new Date().toISOString().split("T")[0],
    sku: item["sku"] || "",
    fn_sku: item["fnsku"] || null,
    asin: item["asin"] || null,
    product_name: item["product-name"] || null,
    product_condition: item["condition"] || null,
    available: parseInt(item["available"]) || 0,
    pending_removal_quantity: parseInt(item["pending-removal-quantity"]) || 0,
    inv_age_0_to_90_days: parseInt(item["inv-age-0-to-90-days"]) || 0,
    inv_age_91_to_180_days: parseInt(item["inv-age-91-to-180-days"]) || 0,
    inv_age_181_to_270_days: parseInt(item["inv-age-181-to-270-days"]) || 0,
    inv_age_271_to_365_days: parseInt(item["inv-age-271-to-365-days"]) || 0,
    inv_age_365_plus_days: parseInt(item["inv-age-365-plus-days"]) || 0,
    qty_to_be_charged_ltsf_6_mo: parseInt(item["qty-to-be-charged-ltsf-6-mo"]) || 0,
    qty_to_be_charged_ltsf_12_mo: parseInt(item["qty-to-be-charged-ltsf-12-mo"]) || 0,
    estimated_ltsf_next_charge: parseFloat(item["estimated-ltsf-next-charge"]) || null,
    weeks_of_cover_t7: parseFloat(item["weeks-of-cover-t7"]) || null,
    weeks_of_cover_t30: parseFloat(item["weeks-of-cover-t30"]) || null,
    weeks_of_cover_t60: parseFloat(item["weeks-of-cover-t60"]) || null,
    weeks_of_cover_t90: parseFloat(item["weeks-of-cover-t90"]) || null,
    units_shipped_t7: parseInt(item["units-shipped-t7"]) || 0,
    units_shipped_t30: parseInt(item["units-shipped-t30"]) || 0,
    units_shipped_t60: parseInt(item["units-shipped-t60"]) || 0,
    units_shipped_t90: parseInt(item["units-shipped-t90"]) || 0,
    recommended_action: item["recommended-action"] || null,
    recommended_removal_quantity: parseInt(item["recommended-removal-quantity"]) || 0,
    synced_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("fba_inventory_planning")
    .upsert(rows, { onConflict: "sku" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} inventory planning records` }
}

// ─── Action: Sync Brand Analytics Search Terms ────────────────────────────────
async function syncSearchTerms(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  const content = await requestAndDownloadReport(
    accessToken,
    "GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT"
  )

  // This report returns JSON
  const reportData = JSON.parse(content)
  const dataRows = reportData?.dataByDepartmentAndSearchTerm ?? reportData ?? []

  // Flatten if needed (it can be nested by department)
  const flatRows = Array.isArray(dataRows) ? dataRows : []

  if (flatRows.length === 0) {
    return { synced: 0, message: "No search terms data returned" }
  }

  const today = new Date().toISOString().split("T")[0]

  const rows = flatRows.slice(0, 500).map((item: Record<string, unknown>) => ({
    report_date: today,
    search_term: (item as Record<string, string>).searchTerm || (item as Record<string, string>).departmentName || "unknown",
    search_frequency_rank: (item as Record<string, number>).searchFrequencyRank ?? null,
    asin_1: (item as Record<string, string>).clickedAsin1 || null,
    click_share_1: (item as Record<string, number>).clickShareRank1 ?? null,
    conversion_share_1: (item as Record<string, number>).conversionShareRank1 ?? null,
    asin_2: (item as Record<string, string>).clickedAsin2 || null,
    click_share_2: (item as Record<string, number>).clickShareRank2 ?? null,
    conversion_share_2: (item as Record<string, number>).conversionShareRank2 ?? null,
    asin_3: (item as Record<string, string>).clickedAsin3 || null,
    click_share_3: (item as Record<string, number>).clickShareRank3 ?? null,
    conversion_share_3: (item as Record<string, number>).conversionShareRank3 ?? null,
    synced_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("brand_search_terms")
    .upsert(rows, { onConflict: "report_date,search_term" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} search term records` }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    const { action } = await req.json()

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    let result

    switch (action) {
      case "inventory":
        result = await syncInventory(supabase)
        break

      case "sales_traffic":
        result = await syncSalesTraffic(supabase)
        break

      case "inventory_detail":
        result = await syncInventoryDetail(supabase)
        break

      case "inventory_planning":
        result = await syncInventoryPlanning(supabase)
        break

      case "search_terms":
        result = await syncSearchTerms(supabase)
        break

      default:
        return new Response(
          JSON.stringify({
            error: `Unknown action: ${action}. Supported: inventory, sales_traffic, inventory_detail, inventory_planning, search_terms`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
    }

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
