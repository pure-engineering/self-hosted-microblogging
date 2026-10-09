import { test, expect } from '@playwright/test';

test('new post gets the next sequential id', async ({ page }) => {
  await page.goto('./posts/new');
  await page.getByRole('textbox', { name: 'Title' }).fill('Id check');
  await page.getByRole('textbox', { name: 'The message' }).fill('Body');
  await page.getByRole('button', { name: 'Post it' }).click();

  const maxId = await page.evaluate(async () => {
    const req = indexedDB.open('Platform');
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = database.transaction('posts', 'readonly');
    const store = tx.objectStore('posts');
    const rows: { id: number }[] = await new Promise((resolve, reject) => {
      const r = store.getAll();
      r.onsuccess = () => resolve(r.result as { id: number }[]);
      r.onerror = () => reject(r.error);
    });
    database.close();
    return Math.max(...rows.map((p) => p.id));
  });
  expect(maxId).toBe(9); // seed is 1-8; random-ID impl fails this (or throws on collision)
});
