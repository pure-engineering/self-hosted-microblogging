import { test, expect } from '@playwright/test';

const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

test('new post with an image renders the image in the feed', async ({
  page,
}) => {
  await page.goto('./posts/new');
  await page.getByRole('textbox', { name: 'Title' }).fill('Image post');
  await page
    .getByRole('textbox', { name: 'The message' })
    .fill('With an image');
  await page.setInputFiles('#uploadImageInput', {
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: PNG_1PX,
  });
  await page.getByRole('button', { name: 'Post it' }).click();
  // Scope to THIS article — seed posts have images, so an unscoped 'article img' would match a seed image and false-green
  const article = page.locator('article').filter({ hasText: 'Image post' });
  await expect(article.locator('img')).toBeVisible();
});
