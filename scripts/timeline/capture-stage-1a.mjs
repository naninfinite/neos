import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', '..');
const outputPath = path.join(
  root,
  'docs',
  'timeline',
  'assets',
  '01-stage-1a',
  'shell-home.png'
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await page.screenshot({ path: outputPath, fullPage: true });

await browser.close();

console.log(`Saved screenshot to ${outputPath}`);