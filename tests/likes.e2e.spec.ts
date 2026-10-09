import { test, expect } from '@playwright/test';

test('like persists across reload', async ({ page }) => {
  await page.goto('./');
  const article = page
    .locator('article')
    .filter({ hasText: 'Amazon launches Scout' });
  await article.getByTitle('Like it!').click();
  await expect(article.locator('svg.bi-heart-fill')).toBeVisible();

  await page.reload();
  await expect(
    page
      .locator('article')
      .filter({ hasText: 'Amazon launches Scout' })
      .locator('svg.bi-heart-fill'),
  ).toBeVisible(); // RED before fix: useState resets on reload
});

test('unlike persists across reload', async ({ page }) => {
  await page.goto('./');
  let article = page
    .locator('article')
    .filter({ hasText: 'Amazon launches Scout' });
  await article.getByTitle('Like it!').click();
  await expect(article.locator('svg.bi-heart-fill')).toBeVisible();

  await article.getByTitle('Like it!').click();
  await expect(article.locator('svg.bi-heart')).toBeVisible();

  await page.reload();
  article = page
    .locator('article')
    .filter({ hasText: 'Amazon launches Scout' });
  await expect(article.locator('svg.bi-heart')).toBeVisible();
  await expect(article.locator('svg.bi-heart-fill')).toHaveCount(0);
});
