import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', '..');

const htmlPath = path.join(root, 'docs', 'timeline', 'site', 'timeline.html');
const pdfPath = path.join(root, 'docs', 'timeline', 'exports', 'neos-timeline.pdf');

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Timeline HTML not found at: ${htmlPath}`);
}

await fs.promises.mkdir(path.dirname(pdfPath), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: {
    top: '16mm',
    right: '16mm',
    bottom: '16mm',
    left: '16mm',
  },
});

await browser.close();

console.log(`Saved PDF to ${pdfPath}`);
