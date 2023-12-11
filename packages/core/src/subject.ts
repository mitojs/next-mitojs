import type { ReactiveSubject } from '@mitojs/utils'
import { getGlobalRegistry } from '@mitojs/utils'

export function registerGlobalSubject(subjectKey: string, subject: ReactiveSubject<any>, _global: Window | typeof globalThis | any) {
  getGlobalRegistry(_global).subjectMap[subjectKey] = subject
}

export function getSubjectFromGlobal<T>(subjectKey: string, _global: Window | typeof globalThis | any): ReactiveSubject<T> | undefined {
  return getGlobalRegistry(_global).subjectMap[subjectKey]
}
