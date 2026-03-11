import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests/visual',
    use: {
        baseURL: 'http://127.0.0.1:4713',
        headless: true,
        viewport: { width: 1440, height: 960 },
    }
});