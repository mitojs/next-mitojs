export interface MitoGlobalRegistryType {
  // use to register subject and reuse it in multiple instances scenario
  subjectMap: { [key: string]: unknown }
  // use to register plugin and reload plugin
  pluginMap: {
    [pluginName: string]: {
      version: string
      apply: (param: unknown) => void
    }
  }
}
