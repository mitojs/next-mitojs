import { isFunction } from './is'
import { noop } from './misc'
/**
 * You can feel free to restore when you hook a function.
 * But you ought to restore 「in order」 if you hooked a value reference or a real obj reference.Because we not store the last value referent for now.
 * eg: obj.a = 1;
 * const r_1 = hookObjectProperty(obj, 'a',() =>2)()
 * const r_2 = hookObjectProperty(obj, 'a',() =>3)()
 * r_2() // obj.a === 2
 * r_1() // obj.a === 1
 *
 * @template T
 * @template K
 * @template P
 * @param {T} obj
 * @param {K} key
 * @param {(origin: T[K], ...params: P) => T[K]} hookFunc
 * @param {boolean} isCatchError When an error occurs after calling a hooked function, we want to suppress the errors and try to call the original function by default.
 * @return {*}
 */
export const hookObjectProperty = <T extends object, K extends keyof T, P extends any[]>(
  obj: T,
  key: K,
  hookFunc: (origin: T[K], ...params: P) => T[K],
  isCatchError = true,
) => {
  return (...params: P) => {
    if (!obj) {
      return noop
    }
    const origin = obj[key]
    let hookedUnsafe = hookFunc(origin, ...params)
    let hooked = hookedUnsafe

    // 给所有 hook 之后的方法包一层 try catch
    if (isFunction(hooked) && isCatchError) {
      hooked = function (this: any, ...args: any) {
        try {
          return (hookedUnsafe as any).apply(this, args)
        } catch {
          // @ts-expect-error
          return isFunction(origin) && origin.apply(this, args)
        }
      } as any as T[K]
    }
    obj[key] = hooked

    // strict: is break
    return (strict?: boolean) => {
      if (!strict) {
        hooked === obj[key] ? (obj[key] = origin) : (hookedUnsafe = origin)
      }
    }
  }
}
