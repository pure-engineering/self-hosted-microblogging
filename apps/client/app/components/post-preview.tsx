import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { db } from '~/services/db';
import type { IAuthor, IPost } from '~/services/db';

function Author({ userId }: { userId: string }) {
  const [author, setAuthor] = useState<IAuthor | null | undefined>(undefined);

  useEffect(() => {
    let stale = false;
    db.authors
      .where('id')
      .equals(userId)
      .toArray()
      .then((rows) => {
        if (!stale) {
          setAuthor(rows[0] ?? null);
        }
      });
    return () => {
      stale = true;
    };
  }, [userId]);

  if (author === undefined) {
    return <span className="text-muted" />;
  }

  if (author === null) {
    return <span className="text-muted">Anonymous</span>;
  }

  return (
    <div>
      <Link to={`/users/${author.username}`} className="link link-neutral">
        {author.name}
      </Link>{' '}
      <span className="text-muted">{`@${author.username}`}</span>
    </div>
  );
}

export type IBlogPost = IPost;

export interface BlogPostProps {
  id: number;
  img?: IPost['img'];
  heading: string;
  text: string;
  hashtags?: string[];
  date?: string;
  htmlDatetime?: string;
  userId: string;
  liked?: boolean;
  onDelete: (id: number) => void;
  onToggleLike: (id: number, next: boolean) => void;
}

export interface IUser {
  id: string;
  username?: string;
  name: string;
  company?: string;
  dob: string;
  about?: string;
  createdAt: number;
}

function BlogPost({
  id,
  heading,
  text,
  hashtags,
  date,
  htmlDatetime,
  img,
  userId,
  liked,
  onDelete,
  onToggleLike,
}: BlogPostProps) {
  return (
    <article className="card mb-3 rounded-md border border-gray-400">
      {img && img.url && (
        <figure>
          <img
            className="img-fluid"
            width={img.width}
            height={img.height}
            src={img.url}
            alt="Card cap"
          />
        </figure>
      )}
      <div className="card-body pb-0">
        <div className="mb-3 flex justify-between border-0 bg-transparent">
          <Author userId={userId} />
          <p className="card-text text-right">
            <time dateTime={htmlDatetime} className="text-muted">
              {date}
            </time>
          </p>
        </div>
        <h3 className="link card-title link-primary mb-2 text-3xl">
          <Link to={`/posts/${id}`} className="">
            {heading}
          </Link>
        </h3>
        <p className="card-text">{text}</p>
        {hashtags && hashtags.length > 0 && (
          <p className="card-text text-sm">
            {hashtags.map((h) => `#${h}`).join(' ')}
          </p>
        )}
      </div>
      <div className="grid grid-cols-12 p-3 pb-1">
        <div className="col-span-6">
          <button
            className="btn btn-circle btn-ghost"
            title="Like it!"
            type="button"
            onClick={(e) => {
              onToggleLike(id, !liked);
              e.currentTarget.blur();
            }}
          >
            {liked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-heart-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-heart"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
            )}
          </button>
        </div>
        <div className="col-span-6 flex justify-end">
          <div className="btn-group-horizontal" role="group">
            <Link
              to={`/posts/${id}/edit`}
              className="btn btn-circle btn-ghost"
              title="Edit post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil"
                viewBox="0 0 16 16"
              >
                <title>Pencil</title>
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
            </Link>
            <button
              className="btn btn-circle btn-ghost"
              title="Remove post"
              type="button"
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm(`Delete post "${heading}"?`)) {
                  onDelete(id);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <title>Trash can</title>
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
