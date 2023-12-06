import { FETCH, hookFetch, unwrapFetch } from './hookFetch'
import { IgnoreList, ReactiveSubject, getDefaultBrowser, isHittingByRegular, noop } from '@mitojs/utils'
import { HttpStartPayload, HttpPayload } from '@mitojs/types'
import { getSubjectFromGlobal } from '@mitojs/core'
interface FetchInstrumentationOptions {
  ignoreUrls?: IgnoreList
}
// todo 添加版本号
const SUBJECT_KEY_FETCH = `${FETCH}_version`

export function createFetchInstrumentation(options: FetchInstrumentationOptions = {}) {
  let subject = getSubjectFromGlobal<HttpStartPayload>(SUBJECT_KEY_FETCH, getDefaultBrowser())
  if (subject) return subject
  subject = new ReactiveSubject<HttpPayload>()
  hookFetch(getDefaultBrowser(), subject.next.bind(subject), (url: string) => {
    return !subject!.observed || isHittingByRegular(url, options.ignoreUrls)
  })
  subject.addTearDown(unwrapFetch)
  return subject
}

// 暴露 wrap fetch 的方法，并返回
