import { hookFetch } from './hookFetch'
import { IgnoreList, Subject, isHittingByRegular, noop } from '@mitojs/utils'
import { HttpStartPayload, HttpPayload } from '@mitojs/types/src'

interface FetchInstrumentationOptions {
  ignoreUrls?: IgnoreList
}

export function createFetchStartInstrumentation(options: FetchInstrumentationOptions) {
  const subject = new Subject<HttpStartPayload>()
  const ignoreUrls = options.ignoreUrls
  hookFetch({
    startCallback: subject.next,
    isSkipWithUrl: (url: string) => {
      // todo 在 Subject 类中补充 subject.hasSubscriber()
      return ignoreUrls ? isHittingByRegular(ignoreUrls, url) : true
    },
  })
}

export function createFetchInstrumentation(options: FetchInstrumentationOptions) {
  const subject = new Subject<HttpPayload>()
  const ignoreUrls = options.ignoreUrls
  hookFetch({
    endCallback: subject.next,
    isSkipWithUrl: (url: string) => {
      // todo 在 Subject 类中补充 subject.hasSubscriber()
      return ignoreUrls ? isHittingByRegular(ignoreUrls, url) : true
    },
  })
}
