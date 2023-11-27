import { ToStringTypes } from '@mitojs/shared'

export function isType(type: string) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }
}

export const isNumber = isType(ToStringTypes.Number)
export const isString = isType(ToStringTypes.String)
export const isBoolean = isType(ToStringTypes.Boolean)
export const isNull = isType(ToStringTypes.Null)
export const isUndefined = isType(ToStringTypes.Undefined)
export const isSymbol = isType(ToStringTypes.Symbol)
export const isFunction = isType(ToStringTypes.Function)
export const isObject = isType(ToStringTypes.Object)
export const isArray = isType(ToStringTypes.Array)
export const isProcess = isType(ToStringTypes.process)
export const isWindow = isType(ToStringTypes.Window)

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {../link isError}.
 *
 * ../param wat A value to be checked.
 * ../returns A boolean representing the result.
 */
export function isError(wat: any): boolean {
  switch (Object.prototype.toString.call(wat)) {
    case '[object Error]':
      return true
    case '[object Exception]':
      return true
    case '[object DOMException]':
      return true
    default:
      return isInstanceOf(wat, Error)
  }
}

/**
 * 检查是否是空对象
 *
 * @export
 * @param {Object} obj 待检测的对象
 * @return {*}  {boolean}
 */
export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0
}

/**
 * check if string is empty
 *
 * @export
 * @param {*} wat
 * @return {*}  {boolean}
 */
export function isEmptyString(wat: any): boolean {
  return isString(wat) && wat.trim() === ''
}

/**
 * Checks whether given value's type is an instance of provided constructor.
 * {../link isInstanceOf}.
 *
 * ../param wat A value to be checked.
 * ../param base A constructor to be used in a check.
 * ../returns A boolean representing the result.
 */
export function isInstanceOf(wat: any, base: any): boolean {
  try {
    // tslint:disable-next-line:no-unsafe-any
    return wat instanceof base
  } catch (_e) {
    return false
  }
}

export function isExistProperty(obj: unknown, key: string | number | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
