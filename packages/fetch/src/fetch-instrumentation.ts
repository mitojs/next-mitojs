import { FETCH, hookFetch, unwrapFetch } from './hook-fetch'
import { IgnoreList, ReactiveSubject, getDefaultBrowser, isHittingByRegular } from '@mitojs/utils'
import { HttpPayload } from '@mitojs/types'
import { getSubjectFromGlobal, registerGlobalSubject } from '@mitojs/core'
interface FetchInstrumentationOptions {
  ignoreUrls?: IgnoreList
}
// todo 如何用 tsc 获取 package.json 下的 version
const SUBJECT_KEY_FETCH = `${FETCH}_version`

export function createFetchInstrumentation(options: FetchInstrumentationOptions = {}) {
  const _window = getDefaultBrowser()
  let subject = getSubjectFromGlobal<HttpPayload>(SUBJECT_KEY_FETCH, _window)
  if (subject) return subject
  subject = new ReactiveSubject<HttpPayload>()
  hookFetch(_window, subject.next.bind(subject), (url: string) => {
    return !subject!.observed || isHittingByRegular(url, options.ignoreUrls)
  })
  subject.addTearDown(unwrapFetch)
  registerGlobalSubject(SUBJECT_KEY_FETCH, subject, _window)
  return subject
}
