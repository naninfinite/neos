import { test, expect } from '@playwright/test'

test('stage 1A shell placeholder renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('NEOS')).toBeVisible();
    await expect(page.getByText('Shell bootstrap')).toBeVisible();
});