import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/slices/auth.slice';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [profilePic, setProfilePic] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('password', form.password);
    if (profilePic) data.append('profilePic', profilePic);

    dispatch(signupUser(data)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Your Account</h2>

        {/* Profile Picture Upload */}
        <div className="flex justify-center">
          <label className="relative w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-400 hover:border-blue-400 cursor-pointer overflow-hidden">
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-center">Upload<br />Photo</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </label>
        </div>

        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-blue-600 text-white py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
