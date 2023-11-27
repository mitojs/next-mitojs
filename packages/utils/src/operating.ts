export const mergeHeaders = (...headers: (HeadersInit | undefined)[]): Record<string, string> => {
  try {
    return headers.reduce((sum: Record<string, string>, cur) => {
      new Headers(cur || {}).forEach((val, key) => (sum[key] = val))
      return sum
    }, {})
  } catch {
    return {}
  }
}
