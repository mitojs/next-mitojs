import fs from 'fs'
import work from 'node:worker_threads'
export const add = (a: number, b: number) => {
  console.log(
    fs.readFile('./index.ts', () => {
      new work.MessagePort()
      console.log(111)
    }),
  )
  return a + b
}
