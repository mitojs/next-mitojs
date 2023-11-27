import { getDefaultBrowser, getFullUrl, mergeHeaders, noop, now, wrap } from '@mitojs/utils'
import { HttpPayload, HttpStartPayload } from '@mitojs/types'
const FETCH = 'fetch'

interface HookFetchOption {
  _window: Window | undefined
  startCallback: (data: HttpStartPayload) => void
  endCallback: (data: HttpPayload) => void
  isSkipWithUrl: (url: string) => boolean | undefined
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
        async (res: Response) => {
          const httpPayload = await normalizePayloadFromResponse(payload, res)
          endCallback(httpPayload)
        },
        () => {
          // @ts-expect-error
          endCallback(undefined)
        },
      )
      return fetchPromise
    }
  })
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

async function normalizePayloadFromResponse(payload: HttpStartPayload, res: Response): Promise<HttpPayload> {
  const timestamp = now()
  let resBody = ''
  try {
    const resClone = res.clone()
    resBody = await resClone.text()
  } catch (_err) {
    // do nothing
  }

  return {
    ...payload,
    response: {
      status: res.status,
      statusText: res.statusText,
      headers: mergeHeaders(res.headers),
      body: resBody,
      timestamp,
      duration: timestamp - payload.request.timestamp,
    },
  }
}
