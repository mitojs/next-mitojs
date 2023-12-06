import type { ReactiveSubject } from '@mitojs/utils'
import { getGlobalRegistry } from '@mitojs/utils'

export type SubjectMap = { [key: string]: ReactiveSubject<any> }

export type MITORegistry = {
  // plugins: LoadedPlugin[]
  // subject: SubjectMap
}

export function registerGlobalSubject(subjectKey: string, subject: ReactiveSubject<any>, _global = window) {
  getGlobalRegistry(_global).subjectMap[subjectKey] = subject
}

export function getSubjectFromGlobal<T>(subjectKey: string, _global = window): ReactiveSubject<T> | undefined {
  return getGlobalRegistry(_global).subjectMap[subjectKey]
}
