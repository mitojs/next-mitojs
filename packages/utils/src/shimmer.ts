/* eslint-disable @typescript-eslint/ban-types */
import { isFunction } from './is'
import { AnyObject } from '@mitojs/types'

export const WRAPPED = '__wrapped__'
export const UNWRAP = '__unwrap__'
export const ORIGINAL = '__original__'

// Default to complaining loudly when things don't go according to plan.
const logger = console.error.bind(console)

// Sets a property on an object, preserving its enumerability.
// This function assumes that the property is already writable.
export function defineProperty(obj: AnyObject, name: string, value: unknown) {
  // eslint-disable-next-line no-prototype-builtins
  const enumerable = !!obj[name] && obj.propertyIsEnumerable(name)
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable,
    writable: true,
    value,
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

  // copy enumerable properties
  for (const enumerableKey in original) {
    if (Object.prototype.hasOwnProperty.call(original, enumerableKey)) {
      wrapped[enumerableKey] = original[enumerableKey]
    }
  }

  defineProperty(wrapped, ORIGINAL, original)
  // prepare for unwrapping
  defineProperty(wrapped, UNWRAP, function () {
    // If no one else wrap it again, it can be "unwrap" when call unwrap function
    if (nodule[name] === wrapped) {
      defineProperty(nodule, name as string, original)
    }
  })
  defineProperty(wrapped, WRAPPED, true)

  // hook original function
  defineProperty(nodule, name as string, wrapped)
  return wrapped
}

export function unwrap(nodule: AnyObject, name: string) {
  if (!nodule || !nodule[name]) {
    logger('no function to unwrap.')
    logger(new Error().stack)
    return
  }

  if (!nodule[name][UNWRAP]) {
    logger('no original to unwrap to -- has ' + name + ' already been unwrapped?')
  } else {
    return nodule[name][UNWRAP]()
  }
}
