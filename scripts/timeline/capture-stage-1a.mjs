import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', '..');
const previewUrl = 'http://127.0.0.1:4173';
const outputPath = path.join(
  root,
  'docs',
  'timeline',
  'assets',
  '01-stage-1a',
  'shell-home.png'
);

const PREVIEW_TIMEOUT_MS = 30_000;

function createPreviewServer() {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCommand, ['run', 'preview'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
  });

  let output = '';
  const append = (chunk) => {
    output += chunk.toString();
    if (output.length > 8_000) {
      output = output.slice(-8_000);
    }
  };

  child.stdout.on('data', append);
  child.stderr.on('data', append);

  return { child, readOutput: () => output };
}

async function isServerReachable(url) {
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(1_000),
    });
    return response.status > 0;
  } catch {
    return false;
  }
}

async function waitForPreview(url, preview, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (preview.child.exitCode !== null) {
      // Allow any trailing stdout/stderr chunks to flush.
      await delay(50);
      const { exitCode, signalCode } = preview.child;
      throw new Error(
        [
          `Preview exited before becoming ready (exit=${exitCode}, signal=${signalCode ?? 'none'}).`,
          preview.readOutput().trim(),
        ]
          .filter(Boolean)
          .join('\n')
      );
    }

    if (await isServerReachable(url)) {
      return;
    }

    await delay(250);
  }

  throw new Error(
    `Timed out waiting for preview at ${url}.\n${preview.readOutput()}`
  );
}

async function stopPreview(preview) {
  if (preview.child.exitCode !== null) {
    return;
  }

  const waitForExit = async (timeoutMs) => {
    if (preview.child.exitCode !== null) {
      return true;
    }

    return Promise.race([
      new Promise((resolve) => preview.child.once('exit', () => resolve(true))),
      delay(timeoutMs).then(() => false),
    ]);
  };

  const sendSignal = (signal) => {
    try {
      if (process.platform === 'win32') {
        preview.child.kill(signal);
      } else {
        process.kill(-preview.child.pid, signal);
      }
    } catch (error) {
      if (error && typeof error === 'object' && error.code === 'ESRCH') {
        return;
      }
      throw error;
    }
  };

  sendSignal('SIGTERM');
  await waitForExit(5_000);

  if (preview.child.exitCode === null) {
    sendSignal('SIGKILL');
    await waitForExit(1_000);
  }
}

const serverAlreadyRunning = await isServerReachable(previewUrl);
let preview = null;

if (!serverAlreadyRunning) {
  preview = createPreviewServer();
  await waitForPreview(previewUrl, preview, PREVIEW_TIMEOUT_MS);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.goto(previewUrl, { waitUntil: 'load' });
  await page.screenshot({ path: outputPath, fullPage: true });
} finally {
  await browser.close();
  if (preview) {
    await stopPreview(preview);
  }
}

console.log(`Saved screenshot to ${outputPath}`);
