import { test, expect } from '@playwright/test';

test('hashtags are saved on create and update', async ({ page }) => {
  await page.goto('./posts/new');
  await page.getByRole('textbox', { name: 'Title' }).fill('Hashtag post');
  await page
    .getByRole('textbox', { name: 'The message' })
    .fill('Body with tags');
  await page
    .locator('textarea[placeholder="Hashtags"]')
    .fill('#Release, bugs  bugs');
  await page.getByRole('button', { name: 'Post it' }).click();

  const article = page.locator('article').filter({ hasText: 'Hashtag post' });
  await expect(article.getByText('#Release #bugs')).toBeVisible();

  await article.locator('.btn-circle[title="Edit post"]').click();
  await page.locator('textarea[placeholder="Hashtags"]').fill('#Fixed');
  await page.getByRole('button', { name: 'Update it' }).click();

  const updated = page.locator('article').filter({ hasText: 'Hashtag post' });
  await expect(updated.getByText('#Fixed')).toBeVisible();
});
