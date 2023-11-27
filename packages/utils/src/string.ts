import { isArray, isString } from './is'

export type IgnoreRegExp = RegExp | null
export type IgnoreList = Array<string | RegExp>
export function getRegexp(ignore: IgnoreList) {
  if (!isArray(ignore)) {
    return null
  }

  return ignore.length ? joinRegExp(ignore) : null
}

export function joinRegExp(patterns: IgnoreList) {
  const sources: string[] = []
  const len = patterns.length

  for (let i = 0; i < len; i++) {
    const pattern = patterns[i]
    if (isString(pattern)) {
      sources.push((pattern as string).replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'))
    } else if (pattern && (pattern as RegExp).source) {
      sources.push((pattern as RegExp).source)
    }
  }
  return new RegExp(sources.join('|'), 'i')
}

export function isHittingByRegular(rules: (string | RegExp)[], url: string): boolean {
  const Rgx = getRegexp(rules || [])
  return !!Rgx && (Rgx as RegExp).test(url)
}
