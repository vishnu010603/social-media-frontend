import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/post.slice';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

export default function FeedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list, status, currentPage, totalPages } = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(fetchPosts(currentPage));
  }, [dispatch, currentPage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Social-Media-App</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/post/new')}
            className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Create Post
          </button>
          <span className="text-sm font-medium text-black hidden sm:block">
            Hi, {user?.name}
          </span>
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden"
          >
            <img
              src={user?.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {status === 'loading' ? (
          <p className="text-center text-gray-600 text-lg">Loading posts...</p>
        ) : list.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xl font-medium">
            No posts to see 👀
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => dispatch(fetchPosts(currentPage - 1))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => dispatch(fetchPosts(currentPage + 1))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      {/* Floating Button for Mobile */}
      <button
        onClick={() => navigate('/post/new')}
        className="sm:hidden fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:bg-blue-700 transition"
        title="Create Post"
      >
        +
      </button>
    </div>
  );
}
