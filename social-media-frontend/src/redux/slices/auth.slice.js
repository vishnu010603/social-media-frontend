import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/user/login', credentials);
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (formData, thunkAPI) => {
  try {
    const res = await axios.post('/user/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const updateProfilePic = createAsyncThunk(
  'auth/updateProfilePic',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.put('/user/profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Make sure this is where you're storing the token
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update profile picture');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profilePic = action.payload;
        }
      })
      .addCase(updateProfilePic.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
