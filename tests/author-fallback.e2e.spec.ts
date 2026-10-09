import { test, expect } from '@playwright/test';

test('authorless post shows Anonymous on the feed', async ({ page }) => {
  await page.goto('./posts/new');
  await page.getByRole('textbox', { name: 'Title' }).fill('Authorless post');
  await page
    .getByRole('textbox', { name: 'The message' })
    .fill('No author row');
  await page.getByRole('button', { name: 'Post it' }).click();

  await expect(
    page
      .locator('article')
      .filter({ hasText: 'Authorless post' })
      .getByText('Anonymous'),
  ).toBeVisible();
});

test('seed post author link navigates to the user page', async ({ page }) => {
  await page.goto('./');

  const link = page.locator('article .link.link-neutral').first();
  const text = (await link.textContent())?.trim();
  await expect(link).toHaveAttribute('href', /\/users\/.+/);

  await link.click();
  await expect(page.locator('h1')).toHaveText(text ?? '');
});
