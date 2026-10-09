import { useNavigate, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '~/services/db';
import type { IBlogPost } from '~/components/post-preview';

function Post({ heading, text }: Partial<IBlogPost>) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <main className="container mx-auto px-4">
      <div className="grid grid-cols-12 gap-1">
        <article className="col-span-12 md:col-span-8 lg:col-span-6">
          <h1 className="mb-6 mt-2 text-4xl">{heading}</h1>
          <p className="text-lg">{text}</p>
          <button
            type="button"
            className="my-5 rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            onClick={handleNavigate}
          >
            Go to home
          </button>
        </article>
      </div>
    </main>
  );
}

function BlogPost() {
  const { postId } = useParams();
  const postArr = useLiveQuery(() =>
    db.posts.where('id').equals(Number(postId)).toArray(),
  );

  return postArr
    ? postArr.map(({ id, heading, text }) => (
        <Post key={id} heading={heading} text={text} />
      ))
    : null;
}

export default BlogPost;
