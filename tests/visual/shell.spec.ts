import { test, expect } from '@playwright/test'

test('site shell renders with channel navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel('Boot overlay')).toBeVisible();
    await expect(page.getByLabel('Boot overlay')).toBeHidden({ timeout: 5000 });

    // Channel bar is visible with navigation
    await expect(page.getByLabel('Site navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'NEOS' })).toBeVisible();

    // Home channel shows panels
    await expect(page.getByLabel('Home')).toBeVisible();
    await expect(page.getByText('ME.EXE')).toBeVisible();
    await expect(page.getByText('YOU.EXE')).toBeVisible();
    await expect(page.getByText('THIRD.EXE')).toBeVisible();

    // Navigate to ME channel — taskbar only appears here
    await page.getByRole('button', { name: 'ME', exact: true }).click();
    await expect(page.getByLabel('ME.EXE')).toBeVisible();
    await expect(page.getByLabel('Taskbar')).toBeVisible();
    await expect(page.getByLabel('System clock')).toContainText(/\d{2}:\d{2}/);

    // Navigate back to home — no taskbar
    await page.getByRole('button', { name: 'NEOS' }).click();
    await expect(page.getByLabel('Home')).toBeVisible();
    await expect(page.getByLabel('Taskbar')).toBeHidden();
});
