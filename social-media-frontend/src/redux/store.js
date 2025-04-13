import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/auth.slice';
import postReducer from '../redux/slices/post.slice';
import commentReducer from '../redux/slices/comment.slice';

export default configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comments: commentReducer,
  },
});
// This is the Redux store configuration for a social media application.
// It uses Redux Toolkit's configureStore function to create a store with three slices:
// 1. auth: Manages user authentication state.
// 2. posts: Manages the state of posts in the application.
// 3. comments: Manages the state of comments on posts.
