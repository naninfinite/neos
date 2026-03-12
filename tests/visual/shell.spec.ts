import { test, expect } from '@playwright/test'

test('stage 1A shell UI renders', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel('Boot overlay')).toBeVisible();
    await expect(page.getByLabel('Boot overlay')).toBeHidden({ timeout: 5000 });

    await expect(page.getByLabel('Desktop surface')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open launcher' })).toBeVisible();
    await expect(page.getByLabel('System clock')).toContainText(/\d{2}:\d{2}/);

    await page.getByRole('button', { name: 'Open launcher' }).click();
    await expect(page.getByRole('dialog', { name: 'NEOS Launcher' })).toBeVisible();
});
