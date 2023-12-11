import { RumPerformanceEntryType } from './constant'

export function applyPerformanceObserver<T extends PerformanceEntry = PerformanceEntry>(
  PerformanceObserver: typeof window.PerformanceObserver | undefined | null | false,
  callback: (entry: T, index: number, array: T[], performanceObserver: PerformanceObserver) => void,
  onFail?: () => void,
) {
  const observer =
    PerformanceObserver &&
    new PerformanceObserver((list, performanceObserver) => {
      if (list.getEntries) {
        list
          .getEntries()
          .forEach((entry, index, performanceEntry) => callback(entry as T, index, performanceEntry as T[], performanceObserver))
      } else {
        onFail && onFail()
      }
    })
  const isPerformanceObserverUnavailable = !PerformanceObserver || !observer
  const observe = (types: string[]) => {
    if (isPerformanceObserverUnavailable) return onFail && onFail()
    try {
      observer.observe({ entryTypes: types })
    } catch {
      return onFail && onFail()
    }
  }

  const observeWithBuffered = (type: string) => {
    if (isPerformanceObserverUnavailable) return onFail && onFail()
    try {
      observer.observe({ type, buffered: true })
    } catch {
      return onFail && onFail()
    }
    observer.observe({ type, buffered: false })
  }

  const disconnect = () => observer && observer.disconnect()

  return [observe, observeWithBuffered, disconnect] as const
}

export const observeRunPerformance = <T extends PerformanceEntry = PerformanceEntry>(
  _PerformanceObserver: typeof window.PerformanceObserver | undefined | null | false,
  pipe: (entry: T) => void,
  types: RumPerformanceEntryType[],
) => {
  const [observe, , disconnect] = applyPerformanceObserver<T>(_PerformanceObserver, pipe)
  observe(types)
  return disconnect
}

export const observeRumPerformanceWithBuffer = <T extends PerformanceEntry = PerformanceEntry>(
  PerformanceObserver: typeof window.PerformanceObserver | undefined | null | false,
  pipe: (entry: T) => void,
  type: RumPerformanceEntryType,
) => {
  const [, bufferedObserver, disconnect] = applyPerformanceObserver<T>(PerformanceObserver, pipe)
  bufferedObserver(type)
  return disconnect
}
