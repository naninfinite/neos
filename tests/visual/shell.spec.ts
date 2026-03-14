import { test, expect } from '@playwright/test'

// IMPORTANT: This test was written for the Stage 1A channel navigation architecture.
// It is currently FAILING because the site root is the SHELL-01A OS desktop (being re-scoped).
// Direction: this test is roughly aligned with the new SITE-SHELL direction (liquid glass
// channel surface with ME.EXE as OS channel) but the specific selectors will need updating
// once SITE-SHELL-01 is implemented.
// DO NOT delete this test — use it as the basis for the new SITE-SHELL integration test.
// Owner: update after SITE-SHELL-01 milestone is complete.

test('site shell renders with channel navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel('Boot overlay')).toBeVisible();
    await expect(page.getByLabel('Boot overlay')).toBeHidden({ timeout: 5000 });

    // Channel bar is visible with navigation
    await expect(page.getByLabel('Site navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'NEOS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Switch Channels' })).toBeVisible();
    await expect(page.getByLabel('Channel switcher')).toHaveCount(0);

    // Home channel shows panels
    await expect(page.getByLabel('Home')).toBeVisible();
    await expect(page.getByLabel('ME.EXE preview')).toBeVisible();
    await expect(page.getByLabel('YOU.EXE preview')).toBeVisible();
    await expect(page.getByLabel('THIRD.EXE preview')).toBeVisible();

    // Navigate to ME channel from home surface — taskbar appears here only
    await page
      .getByLabel('ME.EXE preview')
      .getByRole('button', { name: 'Open ME.EXE' })
      .click();
    await expect(page.getByLabel('ME.EXE')).toBeVisible();
    await expect(page.getByLabel('Taskbar')).toBeVisible();
    await expect(page.getByLabel('System clock')).toContainText(/\d{2}:\d{2}/);

    // Quick switch is secondary navigation and can route to YOU
    await page.getByRole('button', { name: 'Switch Channels' }).click();
    await expect(page.getByLabel('Channel switcher')).toBeVisible();
    await page.getByRole('button', { name: /YOU\.EXE/i }).click();
    await expect(page.getByLabel('YOU.EXE')).toBeVisible();
    await expect(page.getByLabel('Taskbar')).toBeHidden();

    // Navigate back to home
    await page.getByRole('button', { name: 'NEOS' }).click();
    await expect(page.getByLabel('Home')).toBeVisible();
    await expect(page.getByLabel('Taskbar')).toBeHidden();
});
