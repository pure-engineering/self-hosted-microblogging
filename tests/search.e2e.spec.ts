import { test, expect } from '@playwright/test';

test('search input filters the feed by heading and text', async ({ page }) => {
  await page.goto('./');

  const searchbox = page.getByRole('searchbox', { name: 'Search posts' });
  await expect(searchbox).toBeEnabled();

  await searchbox.fill('bitcoin');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      name: /Microsoft Begins Accepting Bitcoin/i,
    }),
  ).toBeVisible();

  await searchbox.fill('');
  await expect(page.locator('article')).toHaveCount(8);

  await searchbox.fill('zzzzzz');
  await expect(page.locator('article')).toHaveCount(0);
});
