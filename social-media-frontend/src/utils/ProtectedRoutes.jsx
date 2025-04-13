import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoutes({ children }) {
  const { user } = useSelector(state => state.auth);
  return user ? children : <Navigate to="/login" />;
}
