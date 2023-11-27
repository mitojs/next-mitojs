import { hookFetch } from './hookFetch'
import { IgnoreList, Subject, isHittingByRegular } from '@mitojs/utils'
import { HttpPayload } from './type'

interface FetchInstrumentationOptions {
  ignoreUrls?: IgnoreList
}
export function createFetchInstrumentation(options: FetchInstrumentationOptions) {
  const subject = new Subject<HttpPayload>()
  const ignoreUrls = options.ignoreUrls
  hookFetch(subject.next, (url: string) => {
    // todo 在 Subject 类中补充 subject.hasSubscriber()
    return ignoreUrls ? isHittingByRegular(ignoreUrls, url) : true
  })
}
