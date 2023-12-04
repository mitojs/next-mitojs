import type { ReactiveSubject } from '@mitojs/utils'

export type MITORegistry = {
  // plugins: LoadedPlugin[]
  // subject: SubjectMap
}

export function registerGlobalSubject(_global = window) {}

export function getSubjectFromGlobal<T>(key: string, _global = window): ReactiveSubject<T> | undefined {
  return _global[key]
}
