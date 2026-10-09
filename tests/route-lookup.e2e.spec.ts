import { test, expect } from '@playwright/test';

test('post detail route renders a known post and returns home', async ({
  page,
}) => {
  await page.goto('./posts/1');
  await expect(
    page.getByRole('heading', { name: /Amazon launches Scout/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Go to home' }).click();
  await expect(page).toHaveURL(/self-hosted-microblogging\/$/);
});

test('missing post route renders without crashing', async ({ page }) => {
  await page.goto('./posts/999999');
  await expect(page.locator('article')).toHaveCount(0);
});

test('edit route pre-fills the post and shows not-found for missing', async ({
  page,
}) => {
  await page.goto('./posts/1/edit');
  await expect(page.locator('textarea[placeholder="Title"]')).toHaveValue(
    /Amazon launches Scout/,
  );
  await page.goto('./posts/999999/edit');
  await expect(page.getByText('Post not found.')).toBeVisible();
});

test('user route resolves a seed author dynamically', async ({ page }) => {
  await page.goto('./');
  const link = page.locator('article .link.link-neutral').first();
  const text = (await link.textContent())?.trim();
  await link.click();
  await expect(page).toHaveURL(/\/users\/.+/);
  await expect(page.locator('h1')).toHaveText(text ?? '');
});
