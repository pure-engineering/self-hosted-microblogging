import { test, expect } from '@playwright/test';

test('feed paginates at 10 with a Load more button', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('article')).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Load more' })).toBeHidden();

  for (const title of ['Page A', 'Page B', 'Page C']) {
    await page.goto('./posts/new');
    await page.getByRole('textbox', { name: 'Title' }).fill(title);
    await page
      .getByRole('textbox', { name: 'The message' })
      .fill(`${title} body`);
    await page.getByRole('button', { name: 'Post it' }).click();
    // Wait for the post to be persisted + shown on the feed before creating the next one.
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  await page.goto('./');
  await expect(page.locator('article')).toHaveCount(10);
  const loadMore = page.getByRole('button', { name: 'Load more' });
  await expect(loadMore).toBeVisible();

  await loadMore.click();
  await expect(page.locator('article')).toHaveCount(11);
  await expect(loadMore).toBeHidden();

  const searchbox = page.getByRole('searchbox', { name: 'Search posts' });
  await searchbox.fill('bitcoin');
  await expect(page.locator('article')).toHaveCount(1);
  await searchbox.fill('');
  await expect(page.locator('article')).toHaveCount(10);
});
