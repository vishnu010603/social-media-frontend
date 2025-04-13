import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../redux/slices/post.slice';
import { useNavigate } from 'react-router-dom';

export default function CreatePostPage() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);
    dispatch(createPost(formData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-5"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Create a Post</h1>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows="5"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          required
        />

        {/* Image Preview */}
        {image && (
          <div className="w-full flex justify-center">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="max-h-48 rounded-lg border object-contain"
            />
          </div>
        )}

        {/* Image Upload */}
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0
            file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
            cursor-pointer rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}
