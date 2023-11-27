/* eslint-disable @typescript-eslint/ban-types */
import { isFunction } from './is'
import { AnyObject } from '@mitojs/types'

// inspire by
const WRAPPED = '__wrapped__'
const UNWRAP = '__unwrap__'
const ORIGINAL = '__original__'

/**
 * This interface defines the params that are be added to the wrapped function
 * using the "shimmer.wrap"
 */
export interface ShimWrapped extends Function {
  [WRAPPED]: boolean
  [UNWRAP]: Function
  [ORIGINAL]: Function
}

// Default to complaining loudly when things don't go according to plan.
const logger = console.error.bind(console)

// Sets a property on an object, preserving its enumerability.
// This function assumes that the property is already writable.
function defineProperty(obj: AnyObject, name: string, value: unknown) {
  // eslint-disable-next-line no-prototype-builtins
  const enumerable = !!obj[name] && obj.propertyIsEnumerable(name)
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: enumerable,
    writable: true,
    value: value,
  })
}

export function wrap<T extends AnyObject, K extends keyof T>(nodule: T, name: K, wrapper: (origin: T[K], name: K) => T[K]) {
  if (!nodule || !nodule[name]) {
    logger('no original function ' + (name as string) + ' to wrap')
    return
  }

  if (!wrapper) {
    logger('no wrapper function')
    logger(new Error().stack)
    return
  }

  if (!isFunction(nodule[name]) || !isFunction(wrapper)) {
    logger('original object and wrapper must be functions')
    return
  }

  const original = nodule[name]
  const wrapped = wrapper(original, name)

  defineProperty(wrapped, ORIGINAL, original)
  defineProperty(wrapped, UNWRAP, function () {
    if (nodule[name] === wrapped) defineProperty(nodule, name as string, original)
  })
  defineProperty(wrapped, WRAPPED, true)

  // hook original function
  defineProperty(nodule, name as string, wrapped)
  return wrapped
}

export function massWrap(nodules: AnyObject[], names: string, wrapper: Function) {
  if (!nodules) {
    logger('must provide one or more modules to patch')
    logger(new Error().stack)
    return
  } else if (!Array.isArray(nodules)) {
    nodules = [nodules]
  }

  if (!(names && Array.isArray(names))) {
    logger('must provide one or more functions to wrap on modules')
    return
  }

  nodules.forEach(function (nodule: AnyObject) {
    names.forEach(function (name) {
      wrap(nodule, name, wrapper as any)
    })
  })
}

export function unwrap(nodule: AnyObject, name: string) {
  if (!nodule || !nodule[name]) {
    logger('no function to unwrap.')
    logger(new Error().stack)
    return
  }

  if (!nodule[name].__unwrap) {
    logger('no original to unwrap to -- has ' + name + ' already been unwrapped?')
  } else {
    return nodule[name].__unwrap()
  }
}

export function massUnwrap(nodules: AnyObject[], names: string) {
  if (!nodules) {
    logger('must provide one or more modules to patch')
    logger(new Error().stack)
    return
  } else if (!Array.isArray(nodules)) {
    nodules = [nodules]
  }

  if (!(names && Array.isArray(names))) {
    logger('must provide one or more functions to unwrap on modules')
    return
  }

  nodules.forEach(function (nodule) {
    names.forEach(function (name) {
      unwrap(nodule, name)
    })
  })
}

export function isWrapped(func: unknown): func is ShimWrapped {
  return (
    typeof func === 'function' &&
    typeof (func as ShimWrapped)[ORIGINAL] === 'function' &&
    typeof (func as ShimWrapped)[UNWRAP] === 'function' &&
    (func as ShimWrapped)[WRAPPED] === true
  )
}
