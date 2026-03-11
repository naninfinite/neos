import { defineConfig } from '@playwright/test'

const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`

export default defineConfig({
  testDir: './tests/visual',
  use: {
    baseURL: PREVIEW_URL,
    headless: true,
    viewport: { width: 1440, height: 960 },
  },
  webServer: {
    command: 'npm run preview',
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
