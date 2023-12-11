import { getDefaultPerformance } from '@mitojs/utils'
import { applyPerformanceObserver } from './apply-performance-observer'

export function createResourceInstrumentation() {
  applyPerformanceObserver(getDefaultPerformance())
}
