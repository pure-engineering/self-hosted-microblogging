import { test, expect } from 'vitest';

import { parseHashtags } from './parse-hashtags';

test('splits on spaces and commas', () => {
  expect(parseHashtags('news,life release')).toStrictEqual([
    'news',
    'life',
    'release',
  ]);
});

test('strips leading # and ##', () => {
  expect(parseHashtags('#news ##life')).toStrictEqual(['news', 'life']);
});

test('drops empty tokens', () => {
  expect(parseHashtags('  ,, #news ,, ')).toStrictEqual(['news']);
});

test('dedupes case-insensitively keeping the first occurrence', () => {
  expect(parseHashtags('Tech, tech TECH')).toStrictEqual(['Tech']);
});

test('empty input returns an empty array', () => {
  expect(parseHashtags('')).toStrictEqual([]);
});

test('only strips leading # (mixed input)', () => {
  expect(parseHashtags(' #news, life stuff#tag ')).toStrictEqual([
    'news',
    'life',
    'stuff#tag',
  ]);
});
