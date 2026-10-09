import { Fragment, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useFeatureValue } from '@growthbook/growthbook-react';

import Search from '~/components/search';

import { db } from '~/services/db';
import { timestampToLocaleString } from '~/services/timestamp-to-locale-string';
import type { IBlogPost } from '~/components/post-preview';
import PostPreview from '~/components/post-preview';

function handleDeleteStory(id: number) {
  db.posts.delete(id);
}

function handleToggleLike(id: number, liked: boolean) {
  db.posts.update(id, { liked });
}

export function PostList({
  query,
  page,
  onLoadMore,
}: {
  query: string;
  page: number;
  onLoadMore: () => void;
}) {
  const posts = useLiveQuery(() =>
    db.posts.orderBy('createdAt').reverse().toArray(),
  );

  if (!posts) {
    return null;
  }

  const q = query.trim().toLowerCase();
  const matched = q
    ? posts.filter(
        (post) =>
          post.heading.toLowerCase().includes(q) ||
          post.text.toLowerCase().includes(q),
      )
    : posts;
  const visible = q ? matched : matched.slice(0, page * 10);
  const hasMore = !q && matched.length > visible.length;

  return (
    <>
      {visible.map((post: IBlogPost) => {
        const { date, htmlDatetime } = timestampToLocaleString(post.createdAt);
        return (
          <Fragment key={post.id}>
            <PostPreview
              id={post.id}
              heading={post.heading}
              text={post.text}
              hashtags={post.hashtags}
              img={post.img}
              date={date}
              htmlDatetime={htmlDatetime}
              userId={post.userId}
              liked={post.liked}
              onDelete={handleDeleteStory}
              onToggleLike={handleToggleLike}
            />
          </Fragment>
        );
      })}
      {hasMore && (
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={onLoadMore}
        >
          Load more
        </button>
      )}
    </>
  );
}

function Home() {
  const featSearchBar = useFeatureValue('search-bar', true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="container mx-auto mb-4 px-4">
      <main className="grid grid-cols-12 gap-1">
        {featSearchBar && <Search value={query} onChange={handleQueryChange} />}
        <section
          className="col-span-12 md:col-span-8 lg:col-span-7"
          role="feed"
        >
          <PostList
            query={query}
            page={page}
            onLoadMore={() => setPage((p) => p + 1)}
          />
        </section>
      </main>
    </div>
  );
}

export default Home;
