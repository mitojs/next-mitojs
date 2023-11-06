import path from 'path'
import fs from 'fs'
// @ts-expect-error
import minimist from 'minimist2'

import type { BunPlugin } from 'bun'

const myPlugin: BunPlugin = {
  name: 'Custom loader',
  setup(build) {
    console.log(build)
  },
}
const rootDir = path.join(import.meta.dir, '../../../')
const packagesDir = path.join(rootDir, 'packages')
const NPM_SCOPE = '@mitojs'
const packageFolders = fs.readdirSync(packagesDir)
const packageNames = packageFolders.map((name) => `${NPM_SCOPE}/${name}`)
const argvMap = minimist(process.argv.slice(2))
const target = argvMap['target']
if (target) {
  const entry = path.join(packagesDir, target, 'src/index.ts')
  const output = path.join(packagesDir, target, 'dist')
  Bun.build({
    entrypoints: [entry],
    outdir: output,
    naming: '[name].esm.js',
    sourcemap: 'external',
    external: [...packageNames, 'rxjs', '@mitojs/rust-bindings'],
    target: 'browser',
    splitting: true,
    minify: {
      whitespace: true,
      syntax: false,
      identifiers: false,
    },
    plugins: [myPlugin],
  })
}
