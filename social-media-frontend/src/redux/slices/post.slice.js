import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';

export const fetchPosts = createAsyncThunk('posts/fetch', async (page = 1, thunkAPI) => {
  try {
    const res = await axios.get(`/posts?page=${page}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to load posts');
  }
});

export const createPost = createAsyncThunk('posts/create', async (formData, thunkAPI) => {
  try {
    const res = await axios.post('/posts', formData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to create post');
  }
});

export const likePost = createAsyncThunk('posts/like', async (id, thunkAPI) => {
  try {
    const res = await axios.put(`/posts/${id}/like`);
    return { id, likes: res.data.likes };
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to like post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (postId, thunkAPI) => {
  try {
    await axios.delete(`/posts`, { params: { postId } });
    return postId;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to delete post');
  }
});

export const updatePost = createAsyncThunk('posts/update', async ({ postId, text }, thunkAPI) => {
  try {
    const res = await axios.put(`/posts/${postId}`, { text });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to update post');
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    totalPages: 1,
    currentPage: 1,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.list.find((p) => p._id === action.payload.id);
        if (post) post.likes = Array(action.payload.likes).fill('like');
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.list = state.list.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.list.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.list[index] = updatedPost; // 🔥 This is the key fix
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
