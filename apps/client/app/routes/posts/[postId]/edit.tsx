/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '~/services/db';
import { parseHashtags } from '~/services/parse-hashtags';
import type { IBlogPost } from '~/components/post-preview';

interface IBlogPostProps {
  post: IBlogPost;
}
interface IStatus {
  status: 'success' | 'info' | 'error';
  message: string;
}

export function EditPost({ post }: IBlogPostProps) {
  const [heading, setHeading] = useState(post.heading);
  const [text, setText] = useState(post.text);
  const [img, setImg] = useState(post.img);
  const [status, setStatus] = useState<IStatus | null>(null);
  const [hashtags, setHashtags] = useState(post.hashtags?.join(', ') ?? '');

  const navigate = useNavigate();
  const { postId } = useParams();

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          setImg({ url: reader.result });
        }
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async function UpdatePost() {
    try {
      await db.posts
        .update(Number(postId), {
          heading,
          text,
          editedAt: Math.floor(Date.now() / 1000),
          hashtags: parseHashtags(hashtags),
          img,
        })
        .then((updated) => {
          if (updated) {
            setStatus({
              status: 'success',
              message: `Post "${heading}" successfully updated. Post id ${postId}`,
            });
            navigate('/');
          } else {
            setStatus({
              status: 'info',
              message: `Nothing happend with ${postId}`,
            });
          }
        });
    } catch (error) {
      setStatus({
        status: 'error',
        message: `Failed to update ${heading}: ${error}`,
      });
    }
  }

  function updateStory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    UpdatePost();
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-3 grid grid-cols-12 gap-1">
        <div className="col-span-12 md:col-span-8 lg:col-span-6">
          {status && (
            <div className={`alert mt-4 alert-${status.status}`}>
              <span>{status.message}</span>
            </div>
          )}
          <h3 className="mb-5 mt-3 text-2xl">Any updates?</h3>
          {img && (
            <figure>
              <img
                id="preview"
                src={img.url}
                alt="Card cap"
                className="card-img-top"
              />
            </figure>
          )}
          <form onSubmit={updateStory}>
            <div className="mb-3">
              <textarea
                placeholder="Title"
                value={heading}
                className="textarea w-full text-3xl"
                onChange={(e) => {
                  setHeading(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Write your text..."
                rows={5}
                className="textarea w-full text-lg"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Hashtags"
                rows={2}
                className="textarea w-full text-lg"
                value={hashtags}
                onChange={(e) => {
                  setHashtags(e.target.value);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <input
                id="uploadImageInput"
                type="file"
                title="Add image"
                className="mt-2 block w-full cursor-pointer text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-500 hover:file:bg-violet-100"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <i className="glyphicon glyphicon-ok" />
              <input
                title="Update post"
                type="submit"
                className="btn btn-outline btn-primary mt-5"
                value="Update it"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditPostWrapper() {
  const { postId } = useParams();
  const posts = useLiveQuery(() =>
    db.posts.where('id').equals(Number(postId)).toArray(),
  );

  if (!posts) {
    return null;
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-3 grid grid-cols-12 gap-1">
          <div className="col-span-12 md:col-span-8 lg:col-span-6">
            <div className="alert alert-info mt-4">
              <span>Post not found.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EditPost post={posts[0]} />;
}

export default EditPostWrapper;
