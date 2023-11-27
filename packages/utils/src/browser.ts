import { isFunction, isObject } from './is'

export function getDefaultBrowser(): undefined | Window {
  if (typeof window === 'object' && isObject(window)) return window
}

export function getDefaultDocument(): undefined | Document {
  if (typeof document === 'object' && isObject(document)) return document
}

export function getDefaultPerformance(): undefined | Performance {
  if (getDefaultBrowser() && isObject(window.performance)) return window.performance
}

export function getDefaultXMLHttpRequest(): undefined | typeof XMLHttpRequest {
  if (typeof XMLHttpRequest === 'function' && isFunction(XMLHttpRequest)) return XMLHttpRequest
}

export function getFullUrl(url: string): string {
  const document = getDefaultDocument()
  if (!document || !url) return ''

  const a = document.createElement('a')
  a.href = url

  return a.href
}
