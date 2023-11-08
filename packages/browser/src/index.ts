import { createBaseClient } from '@mitojs/core'
export const browserAdd = (a: number, b: number) => {
  return a + b + createBaseClient()
}
