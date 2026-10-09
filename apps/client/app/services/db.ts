import Dexie from 'dexie';

import postsJson from '../mocks/posts.json';
import authorsJson from '../mocks/authors.json';

export interface IAuthor {
  id: string;
  username: string;
  name: string;
  dob: string;
  createdAt: number;
}

export interface IPost {
  id: number;
  heading: string;
  text: string;
  createdAt: number;
  hashtags?: string[];
  userId: string;
  img?: {
    width?: number;
    height?: number;
    url?: string;
  };
  editedAt?: number;
  liked?: boolean;
}

export class MySubClassedDexie extends Dexie {
  posts!: Dexie.Table<IPost>;

  authors!: Dexie.Table<IAuthor>;

  constructor() {
    super('Platform');
    this.version(1).stores({
      posts: 'id, heading, text, createdAt, hashtags, userId',
      authors: 'id, username, name',
    });
    this.version(2)
      .stores({
        posts: 'id, heading, text, createdAt, hashtags, userId',
        authors: 'id, username, name',
      })
      .upgrade(async (tx) => {
        await tx
          .table('posts')
          .toCollection()
          .modify((p) => {
            if (p.image && typeof p.image.url === 'string') {
              // eslint-disable-next-line no-param-reassign
              p.img = {
                width: p.image.width,
                height: p.image.height,
                url: p.image.url,
              };
            }
            // eslint-disable-next-line no-param-reassign
            delete p.image;
            if (typeof p.editedAt === 'string') {
              // eslint-disable-next-line no-param-reassign
              p.editedAt = Math.floor(Number(p.editedAt) / 1000);
            }
          });
      });
  }
}

export const db = new MySubClassedDexie();

export async function nextPostId(): Promise<number> {
  const last = await db.posts.orderBy('id').last();
  return (last?.id ?? 0) + 1;
}

db.posts.count((count) => {
  if (count === 0) {
    db.posts.bulkPut(postsJson.result);
    db.authors.bulkPut(
      authorsJson.map((author) => ({
        ...author,
        createdAt: Date.parse(author.createdAt),
      })),
    );
  }
});
