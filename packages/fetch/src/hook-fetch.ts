import { getDefaultBrowser, getFullUrl, mergeHeaders, noop, now, unwrap, wrap } from '@mitojs/utils'
import { HttpPayload, HttpStartPayload } from '@mitojs/types'
export const FETCH = 'fetch'

type HookFetchOption = (
  _window: Window | undefined,
  next: (data: HttpPayload) => void,
  isSkipWithUrl: (url: string) => boolean | undefined,
) => void

/**
 * Generates a hook for intercepting and modifying fetch requests.
 *
 * @param {_window} _window - The window object.
 * @param {function} next - The callback function to be executed after each fetch request.
 * @param {function} isSkipWithUrl - The function to determine if a URL should be skipped.
 * @return {void}
 */
export const hookFetch: HookFetchOption = (_window, next = noop, isSkipWithUrl = () => false) => {
  if (!_window) return
  wrap(_window, FETCH, (originalFetch) => {
    return (input, init = {}) => {
      const fetchPromise = originalFetch(input, init)
      const url = normalizeUrl(input)
      if (isSkipWithUrl(url)) return fetchPromise
      const payload = normalizePayloadFromRequest(input, init)
      next(payload)
      fetchPromise.then(
        async (res: Response) => {
          const httpPayload = await normalizePayloadFromResponse(payload, res)
          next(httpPayload)
        },
        () => {
          // @ts-expect-error
          next(undefined)
        },
      )
      return fetchPromise
    }
  })
}

export function unwrapFetch(_window = getDefaultBrowser()) {
  if (!_window) return
  unwrap(_window, FETCH)
}

function normalizeUrl(input: RequestInfo | URL): string {
  return getFullUrl(input instanceof Request ? input.url : input instanceof URL ? input.href : input)
}

function normalizePayloadFromRequest(input: RequestInfo | URL, init: RequestInit): HttpStartPayload {
  const methodFromParams = (init && init.method) || (input instanceof Request && input.method)
  const method = methodFromParams ? methodFromParams.toUpperCase() : 'GET'
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
    // only support text,not for stream,buffer or others
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
