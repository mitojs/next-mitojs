import { getDefaultBrowser, getFullUrl, mergeHeaders, noop, now, wrap } from '@mitojs/utils'
import { HttpPayload, HttpStartPayload } from '@mitojs/types'
const FETCH = 'fetch'

interface HookFetchOption {
  _window: Window | undefined
  startCallback: (data: HttpStartPayload) => void
  endCallback: (data: HttpPayload) => void
  isSkipWithUrl: (url: string) => boolean
}
export function hookFetch({
  _window = getDefaultBrowser(),
  startCallback = noop,
  endCallback = noop,
  isSkipWithUrl = () => false,
}: Partial<HookFetchOption>) {
  if (!_window) return
  wrap(_window, FETCH, (originalFetch) => {
    return (input, init = {}) => {
      const fetchPromise = originalFetch(input, init)
      const url = normalizeUrl(input)
      if (isSkipWithUrl(url)) return fetchPromise
      const payload = normalizePayloadFromRequest(input, init)
      startCallback(payload)
      fetchPromise.then(
        (res: Response) => {
          endCallback(normalizePayloadFromResponse(payload, res))
        },
        () => {
          // @ts-expect-error
          endCallback(undefined)
        },
      )
      return fetchPromise
    }
  })
  // 传入 callback 拿到参数后调用 .next
}

function normalizeUrl(input: RequestInfo | URL): string {
  return getFullUrl(input instanceof Request ? input.url : input instanceof URL ? input.href : input)
}

function normalizePayloadFromRequest(input: RequestInfo | URL, init: RequestInit): HttpStartPayload {
  const methodFromParams = (init && init.method) || (input instanceof Request && input.method)
  const method = methodFromParams ? methodFromParams.toUpperCase() : 'GET'
  init.body
  return {
    api: FETCH,
    request: {
      method,
      url: normalizeUrl(input),
      headers: mergeHeaders((input as Request).headers, init.headers),
      // input instanceof Request && input.body is ReadableStream which cannot be stringified
      body: init.body?.toString(),
      timestamp: now(),
    },
  }
}

function normalizePayloadFromResponse(payload: HttpStartPayload, res: Response): HttpPayload {
  const timestamp = now()
  return {
    ...payload,
    response: {
      status: res.status,
      headers: mergeHeaders(res.headers),
      body: res.body?.toString(),
      timestamp,
      duration: timestamp - payload.request.timestamp,
    },
  }
}
