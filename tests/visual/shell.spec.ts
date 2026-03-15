import { expect, test } from '@playwright/test';

test('site shell renders hero and stack navigation for isolated channels', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Preparing light glass shell and channel navigation.')).toBeHidden({
    timeout: 5_000,
  });

  const channelNav = page.getByLabel('Channel navigation');

  await expect(page.getByLabel('Site shell')).toBeVisible();
  await expect(channelNav).toBeVisible();
  await expect(channelNav.getByRole('button', { name: 'HOME', exact: true })).toBeVisible();
  await expect(channelNav.getByRole('button', { name: 'ME.EXE', exact: true })).toBeVisible();
  await expect(channelNav.getByRole('button', { name: 'YOU.EXE', exact: true })).toBeVisible();
  await expect(channelNav.getByRole('button', { name: 'THIRD.EXE', exact: true })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Liquid Glass Channel Surface' })).toBeVisible();
  await expect(page.getByText('Featured channel')).toBeVisible();
  await expect(page.getByText('Channel stack')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ME.EXE' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Rotate stack' })).toBeVisible();

  await page.getByRole('button', { name: 'Rotate stack' }).click();
  await expect(page.getByRole('heading', { name: 'YOU.EXE' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter YOU.EXE' })).toBeVisible();

  await page.getByRole('button', { name: 'Enter YOU.EXE' }).click();
  await expect(page.getByRole('heading', { name: 'YOU.EXE placeholder' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back to HOME' })).toBeVisible();
  await expect(page.getByText('No desktop at site root')).toBeVisible();

  await page.getByRole('button', { name: 'Back to HOME' }).click();
  await expect(page.getByRole('heading', { name: 'Liquid Glass Channel Surface' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'YOU.EXE' })).toBeVisible();
  await expect(page.getByText('Active: HOME').first()).toBeVisible();
});
