import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { Input } from '~/components/input';
import { db, nextPostId } from '~/services/db';
import { parseHashtags } from '~/services/parse-hashtags';

function AddPost() {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [hashtags, setHashtags] = useState('');

  const navigate = useNavigate();

  function handleImageChange(event: React.FormEvent<HTMLInputElement>) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async function addPost() {
    try {
      let id: number | undefined;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        // eslint-disable-next-line no-await-in-loop
        const candidateId = await nextPostId();
        try {
          // eslint-disable-next-line no-await-in-loop
          id = await db.posts.add({
            id: candidateId,
            heading,
            text,
            createdAt: Math.floor(Date.now() / 1000),
            userId: uuidv4(),
            hashtags: parseHashtags(hashtags),
            img: image ? { url: image } : undefined,
          });
          break;
        } catch (error) {
          if ((error as Error)?.name !== 'ConstraintError') {
            throw error;
          }
        }
      }

      if (id === undefined) {
        setStatus(`Failed to add ${heading}: could not allocate a free id`);
        return;
      }

      setStatus(`Post "${heading}" successfully added. Got id ${id}`);
      navigate('/');
    } catch (error) {
      setStatus(`Failed to add ${heading}: ${error}`);
    }
  }

  function createStory(event: React.FormEvent) {
    event.preventDefault();
    addPost();
  }

  const titleId = 'titleInput';
  const textFieldId = 'messageTextarea';

  return (
    <div className="container mx-auto px-4">
      <div className="mb-3 grid grid-cols-12 gap-1">
        {status && <h3>{status}</h3>}
        {image && (
          <div className="col-span-12 md:col-span-10 lg:col-span-6">
            <img
              id="preview"
              src={image}
              alt="Card cap"
              className="card-img-top"
            />
          </div>
        )}
        <div className="col-span-12 md:col-span-8 lg:col-span-6">
          <h3 className="mb-5 mt-3 text-2xl">What&apos;s new?</h3>
          <form onSubmit={createStory}>
            <div className="mb-3">
              <Input
                placeholder="Title"
                value={heading}
                id={titleId}
                required
                onChange={(e) => {
                  setHeading(e.target.value);
                }}
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={titleId}>Title is required</label>
            </div>
            <div className="mb-3">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={textFieldId}>The message</label>
              <textarea
                id={textFieldId}
                placeholder="Write your text..."
                rows={5}
                className="textarea w-full text-lg"
                value={text}
                required
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={textFieldId}>The message is required</label>
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
              <button
                title="Add new post"
                type="submit"
                className="btn btn-outline btn-primary mt-5"
              >
                <i className="glyphicon glyphicon-ok" />
                Post it
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
