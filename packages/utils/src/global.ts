import { ReactiveSubject } from './ReactiveSubject'

export interface MitoGlobalRegistryType {
  // use to register subject and reuse it in multiple instances scenario
  subjectMap: {
    [key_version: string]: ReactiveSubject<any>
  }
  // use to register plugin and reload plugin
  pluginMap: {
    [pluginName_version: string]: (param: unknown) => void
  }
}

export const getGlobalRegistry = (() => {
  let init = false
  return (_global: any) => {
    if (init) return <MitoGlobalRegistryType>_global.__MITO__REGISTRY__
    _global.__MITO__REGISTRY__ = {
      subjectMap: {},
      pluginMap: {},
    }
    init = true
    return <MitoGlobalRegistryType>_global.__MITO__REGISTRY__
  }
})()
