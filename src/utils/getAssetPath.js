/**
 * Utility to get the correct asset path considering the basePath configuration.
 * @param {string} src - The source path of the asset.
 * @returns {string} - The normalized asset path.
 */
export const getAssetPath = src => {
  if (!src) return ''

  // If it's an external URL, return as is
  if (src.startsWith('http') || src.startsWith('//')) {
    return src
  }

  const basePath = process.env.NEXT_PUBLIC_BASEPATH || ''

  // Ensure leading slash if not present
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`

  // Avoid doubling the basePath if it's already there (though unlikely in current setup)
  if (basePath && normalizedSrc.startsWith(basePath)) {
    return normalizedSrc
  }

  return `${basePath}${normalizedSrc}`
}
