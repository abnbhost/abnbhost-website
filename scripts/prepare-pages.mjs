import {cp, mkdir, readdir, rm} from 'node:fs/promises'
import {join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const output = join(root, 'pages-dist')
const skip = new Set(['.git', '.github', 'node_modules', 'sanity-studio', 'pages-dist', 'scripts'])

await rm(output, {recursive: true, force: true})
await mkdir(output, {recursive: true})

for (const entry of await readdir(root)) {
  if (!skip.has(entry)) await cp(join(root, entry), join(output, entry), {recursive: true})
}

await cp(join(root, 'sanity-studio', 'dist'), join(output, 'studio'), {recursive: true})
