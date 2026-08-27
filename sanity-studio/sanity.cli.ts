import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'nvnz9p1u',
    dataset: 'production'
  },
  project: {
    basePath: '/studio'
  }
})
