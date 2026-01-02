import { config } from 'dotenv'
import { defineConfig } from 'orval'

// Carregar variáveis de ambiente do arquivo .env
config()

export default defineConfig({
  api: {
    input: '../api/swagger.json',
    output: {
      target: './src/http/api.ts',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'apiMutator',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'npx biome format --write',
    },
  },
})
