import { expect, test } from '@playwright/test';

test('index page has expected button', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Alert' })).toBeVisible();
});
