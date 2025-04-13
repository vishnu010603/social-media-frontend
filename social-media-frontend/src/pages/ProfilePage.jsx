import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateProfilePic, logout } from '../redux/slices/auth.slice';
import { deletePost, updatePost } from '../redux/slices/post.slice';
import { deleteComment } from '../redux/slices/comment.slice';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const posts = useSelector((state) =>
    state.posts.list.filter((p) => p.createdBy._id === user.id)
  );
  const comments = useSelector((state) => state.comments.list);
  const dispatch = useDispatch();

  const [newPic, setNewPic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditingPic, setIsEditingPic] = useState(false);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePicUpload = () => {
    if (newPic) {
      const formData = new FormData();
      formData.append('profilePic', newPic);
      dispatch(updateProfilePic(formData));
      setIsEditingPic(false);
      setNewPic(null);
      setPreview(null);
    }
  };

  const handlePostDelete = (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
    }
  };

  const handlePostUpdate = (postId) => {
    if (editingText.trim()) {
      dispatch(updatePost({ postId, text: editingText }));
      setEditingPostId(null);
      setEditingText('');
    }
  };

  const handleCommentDelete = (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(commentId));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={preview || user.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-bold text-black">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {!isEditingPic ? (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setIsEditingPic(true)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Update Picture
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
                    className="text-sm mt-2"
                  />
                  {newPic && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handlePicUpload}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setNewPic(null);
                          setPreview(null);
                          setIsEditingPic(false);
                        }}
                        className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Your Posts</h3>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-gray-50 p-4 rounded shadow">
                  {editingPostId === post._id ? (
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full border p-2 rounded text-sm mb-2"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{post.text}</p>
                  )}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-2 rounded object-cover max-h-60 w-full"
                    />
                  )}

                  <div className="flex gap-2 text-sm mt-3">
                    {editingPostId === post._id ? (
                      <>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handlePostUpdate(post._id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500 hover:underline"
                          onClick={() => {
                            setEditingPostId(null);
                            setEditingText('');
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setEditingPostId(post._id);
                            setEditingText(post.text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handlePostDelete(post._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {/* Comments */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">Comments</p>
                    {comments.filter((c) => c.postId === post._id).length === 0 ? (
                      <p className="text-sm text-gray-400">No comments yet.</p>
                    ) : (
                      comments
                        .filter((c) => c.postId === post._id)
                        .map((comment) => (
                          <div
                            key={comment._id}
                            className="flex justify-between items-center bg-white p-2 rounded mt-2 shadow-sm"
                          >
                            <div className="text-sm">
                              <span className="font-medium">{comment.userId.name}:</span>{' '}
                              {comment.text}
                            </div>
                            <button
                              onClick={() => handleCommentDelete(comment._id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
