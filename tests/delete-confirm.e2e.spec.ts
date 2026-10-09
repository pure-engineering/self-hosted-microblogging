import { test, expect } from '@playwright/test';

test('delete asks for confirmation; cancel keeps the post, OK removes it', async ({
  page,
}) => {
  await page.goto('./');
  const article = page
    .locator('article')
    .filter({ hasText: 'Convoy! The Fueloyal' });
  let message = '';
  page.once('dialog', (d) => {
    message = d.message();
    d.dismiss();
  });
  await article.getByTitle('Remove post').click();
  await expect(article).toBeVisible(); // cancel path
  expect(message).toContain('Convoy!'); // RED before fix: no dialog ever fires
  page.once('dialog', (d) => d.accept());
  await article.getByTitle('Remove post').click();
  await expect(article).toHaveCount(0); // accept path
});
