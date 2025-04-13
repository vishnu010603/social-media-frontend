import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId, thunkAPI) => {
    try {
      const res = await axios.get(`/comments/${postId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to load comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ postId, text, parentId }, thunkAPI) => {
    try {
      const res = await axios.post(`/comments/${postId}`, { text, parentId });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId, thunkAPI) => {
    try {
      await axios.delete(`/comments`,{
        params:{id: commentId}
      });
      return commentId;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to delete comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ id, text }, thunkAPI) => {
    try {
      const res = await axios.put(`/comments/${id}`, { text });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to update comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearComments(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter(comment => comment._id !== id && comment.parentId !== id);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(c => c._id === updated._id);
        if (index !== -1) state.list[index] = updated;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
