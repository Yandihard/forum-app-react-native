import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/api';

interface AuthState {
  user: any;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// Thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const token = await api.login(credentials);
      await api.putAccessToken(token);
      const user = await api.getOwnProfile();
      await api.putUserProfile(user);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const user = await api.register(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await api.clearAccessToken();
    return null;
  }
);

export const getOwnProfileThunk = createAsyncThunk(
  'auth/getOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await api.getOwnProfile();
      await api.putUserProfile(user);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const initAuthThunk = createAsyncThunk(
  'auth/initAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await api.getAccessToken();
      const user = await api.getUserProfile();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
      })
      .addCase(initAuthThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(getOwnProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
