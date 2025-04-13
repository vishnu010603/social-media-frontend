import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoutes from './utils/protectedRoutes';
import SignupPage from './pages/SignUpPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoutes><FeedPage /></ProtectedRoutes>} />
        <Route path="/post/new" element={<ProtectedRoutes><CreatePostPage /></ProtectedRoutes>} />
        <Route path="/profile" element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>} />
      </Routes>
    </Router>
  );
}
