// export interface BaseClientType<O extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
//   /**
//    *SDK名称
//    *
//    * @type {string}
//    * @memberof BaseClientType
//    * @static
//    */
//   SDK_NAME?: string
//   /**
//    *SDK版本
//    *
//    * @type {string}
//    * @memberof BaseClientType
//    */
//   SDK_VERSION: string

//   /**
//    *配置项和钩子函数
//    *
//    * @type {O}
//    * @memberof BaseClientType
//    */
//   options: O

//   /**
//    *返回配置项和钩子函数
//    *
//    * @return {*}  {O}
//    * @memberof BaseClientType
//    */
//   getOptions(): O
// }

export enum STATUS {
  INITIAL,
  RUNNING,
  PAUSE,
  DESTROY,
}
// rxjs 加入 console.log
// class BaseClient {
//   private status: STATUS = STATUS.INITIAL
//   constructor() {}

//   applyIntegrations() {}
// }
export const createBaseClient = () => {}
