import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../redux/slices/post.slice';
import { addComment, fetchComments } from '../redux/slices/comment.slice';
import { useState, useEffect } from 'react';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: allComments } = useSelector(state => state.comments);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likes.includes(user.id);

  // Filter comments for this post
  const comments = allComments.filter(c => c.postId === post._id && !c.parentId);

  useEffect(() => {
    if (showComments) dispatch(fetchComments(post._id));
  }, [showComments, dispatch, post._id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(addComment({ postId: post._id, text: commentText }));
      setCommentText('');
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md mb-6">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.createdBy.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{post.createdBy.name}</h3>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-gray-800 mb-3">{post.text}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg object-cover max-h-96 mb-3"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t mt-4">
        <button
          onClick={() => dispatch(likePost(post._id))}
          className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition ${
            isLiked ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👍 {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
        </button>

        <button
  onClick={() => setShowComments(!showComments)}
  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-full transition"
>
  💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
</button>

      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 border-t pt-4 space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <img
              src={user.profilePic}
              alt="You"
              className="w-8 h-8 rounded-full object-cover"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="text-blue-600 font-semibold hover:underline"
            >
              Post
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="flex items-start gap-2">
                  <img
                    src={c.userId.profilePic}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={c.userId.name}
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-[80%]">
                    <p className="text-sm font-semibold text-gray-700">{c.userId.name}</p>
                    <p className="text-sm text-gray-800">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
