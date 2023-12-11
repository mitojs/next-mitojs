import { ReactiveSubject, getDefaultBrowser, getDefaultPerformanceObserver } from '@mitojs/utils'
import { observeRunPerformance } from './apply-performance-observer'
import { getSubjectFromGlobal, registerGlobalSubject } from '@mitojs/core'
import { ResourceTimingType } from '@mitojs/types'
import { RumPerformanceEntryType } from './constant'

const SUBJECT_KEY_RESOURCE = 'resource_version'
export function createResourceInstrumentation() {
  const _window = getDefaultBrowser()
  let subject = getSubjectFromGlobal<ResourceTimingType>(SUBJECT_KEY_RESOURCE, _window)
  if (subject) return subject
  subject = new ReactiveSubject<ResourceTimingType>()
  const disconnect = observeRunPerformance(getDefaultPerformanceObserver(), subject.next.bind(subject), [RumPerformanceEntryType.RESOURCE])
  subject.addTearDown(disconnect)
  registerGlobalSubject(SUBJECT_KEY_RESOURCE, subject, _window)
  return subject
}
