import { hookFetch, unwrapFetch } from './hookFetch'
import { IgnoreList, ReactiveSubject, getDefaultBrowser, isHittingByRegular, noop } from '@mitojs/utils'
import { HttpStartPayload, HttpPayload } from '@mitojs/types'
import { getSubjectFromGlobal } from '@mitojs/core'
interface FetchInstrumentationOptions {
  ignoreUrls?: IgnoreList
}
const FETCH_START = 'f_s'
const FETCH_END = 'f_e'
export function createFetchStartInstrumentation(options: FetchInstrumentationOptions = {}) {
  let subject = getSubjectFromGlobal<HttpStartPayload>(FETCH_START, getDefaultBrowser())
  if (subject) return subject
  subject = new ReactiveSubject<HttpStartPayload>()
  hookFetch({
    startCallback: subject.next.bind(subject),
    isSkipWithUrl: (url: string) => {
      return !subject!.observed || isHittingByRegular(url, options.ignoreUrls)
    },
  })
  subject.addTearDown(unwrapFetch)
  return subject
}

export function createFetchInstrumentation(options: FetchInstrumentationOptions = {}) {
  let subject = getSubjectFromGlobal<HttpStartPayload>(FETCH_END, getDefaultBrowser())
  if (subject) return subject
  subject = new ReactiveSubject<HttpPayload>()
  hookFetch({
    endCallback: subject.next.bind(subject),
    isSkipWithUrl: (url: string) => {
      return !subject!.observed || isHittingByRegular(url, options.ignoreUrls)
    },
  })
  return subject
}
