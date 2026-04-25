import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/api';

interface LeaderboardState {
  leaderboards: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeaderboardState = {
  leaderboards: [],
  status: 'idle',
  error: null,
};

export const fetchLeaderboardsThunk = createAsyncThunk(
  'leaderboards/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getLeaderboards();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboardsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboardsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaderboards = action.payload;
      })
      .addCase(fetchLeaderboardsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default leaderboardSlice.reducer;
