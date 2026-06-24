import { defineConfig } from '@playwright/test';

const port = Number(process.env.PORT ?? 4173);

export default defineConfig({
    testDir: './e2e',
    timeout: 30_000,
    expect: {
        timeout: 5_000
    },
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        viewport: { width: 1280, height: 720 }
    },
    projects: [
        {
            name: 'chrome',
            use: {
                channel: 'chrome'
            }
        }
    ],
    webServer: {
        command: `node ./scripts/serve.js`,
        port,
        reuseExistingServer: !process.env.CI
    }
});
