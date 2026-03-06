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

// ─── Action: Sync Replenishment Metrics ───────────────────────────────────────
async function syncReplenishmentMetrics(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  // Use 2025-01-01 as start — Postman confirmed older dates return 403
  const body = {
    aggregationFrequency: "MONTH",
    timeInterval: {
      startDate: "2025-01-01T00:00:00Z",
      endDate: new Date().toISOString()
    },
    marketplaceId: MARKETPLACE_US,      // Required
    programTypes: ["SUBSCRIBE_AND_SAVE"],  // Required
    metrics: [
      "SHIPPED_SUBSCRIPTION_UNITS",
      "TOTAL_SUBSCRIPTIONS_REVENUE",
      "ACTIVE_SUBSCRIPTIONS",
      "LOST_REVENUE_DUE_TO_OOS",
      "NOT_DELIVERED_DUE_TO_OOS",
      "SUBSCRIBER_NON_SUBSCRIBER_AVERAGE_REVENUE",
      "SUBSCRIBER_RETENTION"
    ],
    timePeriodType: "PERFORMANCE"
  }

  // Confirmed endpoint from Postman: /sellingPartners/metrics/search
  const res = await fetch(`${SP_API_BASE}/replenishment/2022-11-07/sellingPartners/metrics/search`, {
    method: "POST",
    headers: {
      "x-amz-access-token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errText = await res.text()

    throw new Error(`Replenishment API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const metrics = data?.metrics ?? []

  if (metrics.length === 0) {
    return { synced: 0, message: "No replenishment metrics returned" }
  }

  const rows = metrics.map((item: Record<string, unknown>) => {
    // Use the actual interval start date as the unique key — no redundancy
    const interval = item.timeInterval as Record<string, string> | undefined

    const weekStartDate = interval?.startDate
      ? interval.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0]

    return {
      report_date: weekStartDate,
      marketplace_id: MARKETPLACE_US,

      // Performance metrics confirmed from API
      shipped_subscription_units: (item.shippedSubscriptionUnits as number) ?? 0,
      total_subscriptions_revenue: (item.totalSubscriptionsRevenue as number) ?? 0,
      active_subscriptions: (item.activeSubscriptions as number) ?? 0,
      lost_revenue_due_to_oos: (item.lostRevenueDueToOOS as number) ?? 0,
      not_delivered_due_to_oos: (item.notDeliveredDueToOOS as number) ?? 0,
      subscriber_avg_revenue: (item.subscriberNonSubscriberAverageRevenue as number) ?? 0,
      subscriber_retention: (item.subscriberRetention as number) ?? 0,
      currency_code: (item.currencyCode as string) ?? "USD",

      synced_at: new Date().toISOString()
    }
  })

  const { error } = await supabase
    .from("replenishment_metrics")
    .upsert(rows, { onConflict: "report_date,marketplace_id" })

  if (error) throw new Error(`DB upsert failed: ${error.message}`)

  return { synced: rows.length, message: `Successfully synced ${rows.length} replenishment metrics records` }
}

// ─── Action: Send Solicitations ────────────────────────────────────────────────
async function sendSolicitations(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  // 1. Fetch Orders from the last 30 days
  const url = new URL(`${SP_API_BASE}/orders/v0/orders`)

  url.searchParams.set("MarketplaceIds", MARKETPLACE_US)
  url.searchParams.set("OrderStatuses", "Shipped")

  // 30 days ago
  const thirtyDaysAgo = new Date()

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  url.searchParams.set("CreatedAfter", thirtyDaysAgo.toISOString())

  const res = await fetch(url.toString(), {
    headers: {
      "x-amz-access-token": accessToken,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const errText = await res.text()

    throw new Error(`Orders API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const orders = data?.payload?.Orders ?? []

  if (orders.length === 0) {
    return { synced: 0, message: "No recent shipped orders found." }
  }

  // 2. Fetch already processed orders from our DB
  const { data: existingSolicitations } = await supabase
    .from("solicitations")
    .select("amazon_order_id")
    .eq("marketplace_id", MARKETPLACE_US)

  const processedSet = new Set((existingSolicitations || []).map(r => r.amazon_order_id))

  let sentCount = 0
  let skippedCount = 0
  let errorCount = 0

  const fiveDaysAgo = new Date()

  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

  // 3. Process eligible orders
  for (const order of orders) {
    const orderId = order.AmazonOrderId
    const purchaseDateStr = order.PurchaseDate

    if (!orderId || !purchaseDateStr) continue

    // Skip if we've already processed this order
    if (processedSet.has(orderId)) {
      skippedCount++
      continue
    }

    // Eligibility check: Request must be sent 5 to 30 days after the order purchase date
    const purchaseDate = new Date(purchaseDateStr)

    if (purchaseDate > fiveDaysAgo || purchaseDate < thirtyDaysAgo) {
      // Too new (< 5 days) or too old (> 30 days, though API restricts this already)
      skippedCount++
      continue
    }

    // 4. Send Solicitation request
    const solUrl = new URL(`${SP_API_BASE}/solicitations/v1/orders/${orderId}/solicitations/productReviewAndSellerFeedback`)

    solUrl.searchParams.set("marketplaceIds", MARKETPLACE_US)

    const solRes = await fetch(solUrl.toString(), {
      method: "POST",
      headers: {
        "x-amz-access-token": accessToken,
        "Content-Type": "application/json",
      },
    })

    const status = solRes.status
    let dbStatus = "error"
    let errMessage = null

    if (status === 201) {
      dbStatus = "sent"
      sentCount++
    } else if (status === 409) { // 409 Conflict: Already solicited
      dbStatus = "already_solicited"
      skippedCount++
    } else if (status === 403) { // 403 Forbidden: Ineligible (e.g. buyer opted out)
      dbStatus = "ineligible"
      skippedCount++
    } else {
      dbStatus = "error"
      errMessage = await solRes.text()
      errorCount++
    }

    // 5. Log it to the DB so we don't try again
    await supabase.from("solicitations").insert({
      amazon_order_id: orderId,
      marketplace_id: MARKETPLACE_US,
      status: dbStatus,
      http_status: status,
      error_message: errMessage,
      order_date: purchaseDateStr
    })

    // Solicitations API is 1 request per second
    // We sleep 1s to avoid 429 Too Many Requests
    await sleep(1000)
  }

  return {
    synced: sentCount,
    message: `Solicitations finished processing. Sent: ${sentCount}. Skipped: ${skippedCount}. Errors: ${errorCount}.`
  }
}

// ─── Sync Finances ────────────────────────────────────────────────────────────
async function syncFinances(supabase: any) {
  const accessToken = await getAccessToken()

  // 30 days ago
  const date = new Date()

  date.setDate(date.getDate() - 30)
  const postedAfter = date.toISOString()

  let nextToken = ""
  let totalProcessed = 0
  let totalUpserted = 0

  do {
    let url = `${SP_API_BASE}/finances/2024-06-19/transactions?postedAfter=${postedAfter}&marketplaceId=${MARKETPLACE_US}`

    if (nextToken) url += `&nextToken=${encodeURIComponent(nextToken)}`

    const res = await fetch(url, {
      headers: {
        "x-amz-access-token": accessToken,
        "Accept": "application/json"
      }
    })

    if (!res.ok) {
      const errText = await res.text()

      throw new Error(`Finances API failed: ${errText}`)
    }

    const data = await res.json()
    const transactions = data.transactions || []

    nextToken = data.nextToken || ""

    if (transactions.length === 0) break
    totalProcessed += transactions.length

    const records = transactions.map((t: any) => {
      let revenue = 0
      let fees = 0

      // Financial components breakdown
      if (t.breakdowns && Array.isArray(t.breakdowns)) {
        t.breakdowns.forEach((b: any) => {
          const type = (b.breakdownType || "").toLowerCase()

          // Support differing API schema versions just in case
          const amount = b.breakdownAmount?.currencyAmount || b.breakdownAmount?.amount || 0

          if (type.includes("principal") || type.includes("tax")) {
             revenue += amount
          } else if (type.includes("fee") || type.includes("commission")) {
             fees += amount
          }
        })
      }

      // Extract context like OrderID and SKU
      let amazonOrderId = null
      let sellerSku = null

      if (t.relatedIdentifiers && Array.isArray(t.relatedIdentifiers)) {
        const orderIdObj = t.relatedIdentifiers.find((id: any) => id.relatedIdentifierName === "ORDER_ID" || id.relatedIdentifierName === "AmazonOrderId")

        if (orderIdObj) amazonOrderId = orderIdObj.relatedIdentifierValue

        const skuObj = t.relatedIdentifiers.find((id: any) => id.relatedIdentifierName === "SELLER_SKU" || id.relatedIdentifierName === "SellerSKU")

        if (skuObj) sellerSku = skuObj.relatedIdentifierValue
      }

      if (!sellerSku && t.contexts && Array.isArray(t.contexts)) {
        const skuCtx = t.contexts.find((c: any) => c.sku)

        if (skuCtx) sellerSku = skuCtx.sku
      }

      return {
        transaction_id: t.transactionId,
        amazon_order_id: amazonOrderId,
        posted_date: t.postedDate,
        transaction_type: t.transactionType,
        seller_sku: sellerSku,
        revenue: revenue,
        fees: fees
      }
    })

    // Upsert into our new financial_events table
    const { error } = await supabase.from("financial_events").upsert(records, { onConflict: "transaction_id" })

    if (error) {
      console.error("Upsert finances DB error:", error)
    } else {
      totalUpserted += records.length
    }

    // Rate Limit for finances API is usually tight (e.g. 0.5/sec)
    if (nextToken) {
      await sleep(2000)
    }

  } while (nextToken)

  return {
    synced: totalUpserted,
    processed: totalProcessed,
    message: `Finances sync completed. Upserted ${totalUpserted} events.`
  }
}

// ─── Sync Subscribe and Save ──────────────────────────────────────────────────
async function syncSns(supabase: ReturnType<typeof createClient>) {
  const accessToken = await getAccessToken()

  // 1. Fetch Performance Data
  const perfTs = await requestAndDownloadReport(
      accessToken,
      'GET_FBA_SNS_PERFORMANCE_DATA',
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      new Date().toISOString()
  );

  const perfLines = perfTs.split('\n');
  const perfHeaders = perfLines[0].split('\t');
  const skuIdxPerf = perfHeaders.findIndex(h => h.toLowerCase() === 'sku');
  const subsIdx = perfHeaders.findIndex(h => h.toLowerCase() === 'active subscriptions');
  const shippedUnitsIdx = perfHeaders.findIndex(h => h.toLowerCase() === 'shipped units trailing 4 weeks');

  const perfUpserts = [];

  if (skuIdxPerf !== -1 && subsIdx !== -1 && shippedUnitsIdx !== -1) { // Ensure all required headers are found
      for (let i = 1; i < perfLines.length; i++) {
          if (!perfLines[i].trim()) continue;
          const values = perfLines[i].split('\t');

          perfUpserts.push({
              seller_sku: values[skuIdxPerf],
              active_subscriptions: parseInt(values[subsIdx]) || 0,
              shipped_units: parseInt(values[shippedUnitsIdx]) || 0,
              synced_at: new Date().toISOString()
          });
      }
  }

  if (perfUpserts.length > 0) {
      const { error: pErr } = await supabase.from('sns_performance').upsert(perfUpserts, { onConflict: 'seller_sku' });

      if (pErr) console.error("Error upserting sns_performance", pErr);
  }

  // 2. Fetch Forecast Data
  const forecastTs = await requestAndDownloadReport(accessToken, 'GET_FBA_SNS_FORECAST_DATA');
  const fcLines = forecastTs.split('\n');
  const fcHeaders = fcLines[0].split('\t');

  const skuIdxFc = fcHeaders.findIndex(h => h.toLowerCase() === 'sku');
  const rev30Idx = fcHeaders.findIndex(h => h.toLowerCase() === 'expected revenue 30d');
  const rev60Idx = fcHeaders.findIndex(h => h.toLowerCase() === 'expected revenue 60d');
  const rev90Idx = fcHeaders.findIndex(h => h.toLowerCase() === 'expected revenue 90d');

  const forecastUpserts = [];

  if (skuIdxFc !== -1 && rev30Idx !== -1 && rev60Idx !== -1 && rev90Idx !== -1) { // Ensure all required headers are found
      for (let i = 1; i < fcLines.length; i++) {
          if (!fcLines[i].trim()) continue;
          const values = fcLines[i].split('\t');

          forecastUpserts.push({
              seller_sku: values[skuIdxFc],
              planned_revenue_30d: parseFloat(values[rev30Idx]) || 0,
              planned_revenue_60d: parseFloat(values[rev60Idx]) || 0,
              planned_revenue_90d: parseFloat(values[rev90Idx]) || 0,
              synced_at: new Date().toISOString()
          });
      }
  }

  if (forecastUpserts.length > 0) {
      const { error: fErr } = await supabase.from('sns_forecast').upsert(forecastUpserts, { onConflict: 'seller_sku' });

      if (fErr) console.error("Error upserting sns_forecast", fErr);
  }

  return {
      message: 'Subscribe and Save synced',
      performanceCount: perfUpserts.length,
      forecastCount: forecastUpserts.length
  };
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

      case "replenishment_metrics":
        result = await syncReplenishmentMetrics(supabase)
        break

      case "send_solicitations":
        result = await sendSolicitations(supabase)
        break

      case "finances":
        result = await syncFinances(supabase)
        break

      case "sns":
        result = await syncSns(supabase)
        break

      default:
        return new Response(
          JSON.stringify({
            error: `Unknown action: ${action}. Supported: inventory, sales_traffic, inventory_detail, inventory_planning, search_terms, replenishment_metrics, send_solicitations, finances, sns`,
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
