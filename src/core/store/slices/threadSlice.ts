import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/api';

interface ThreadState {
  threads: any[];
  detailThread: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  detailThread: null,
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const fetchThreadsThunk = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getAllThreads();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDetailThreadThunk = createAsyncThunk(
  'threads/fetchDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      return await api.getDetailThread(threadId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createThreadThunk = createAsyncThunk(
  'threads/create',
  async (threadData: any, { rejectWithValue }) => {
    try {
      return await api.createThread(threadData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const upVoteThreadThunk = createAsyncThunk(
  'threads/upVote',
  async (threadId: string, { rejectWithValue }) => {
    try {
      return await api.upVoteThread(threadId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const downVoteThreadThunk = createAsyncThunk(
  'threads/downVote',
  async (threadId: string, { rejectWithValue }) => {
    try {
      return await api.downVoteThread(threadId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const neutralVoteThreadThunk = createAsyncThunk(
  'threads/neutralVote',
  async (threadId: string, { rejectWithValue }) => {
    try {
      return await api.neutralVoteThread(threadId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const upVoteCommentThunk = createAsyncThunk(
  'threads/upVoteComment',
  async ({ threadId, commentId }: { threadId: string; commentId: string }, { rejectWithValue }) => {
    try {
      return await api.upVoteComment({ threadId, commentId });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const downVoteCommentThunk = createAsyncThunk(
  'threads/downVoteComment',
  async ({ threadId, commentId }: { threadId: string; commentId: string }, { rejectWithValue }) => {
    try {
      return await api.downVoteComment({ threadId, commentId });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const neutralVoteCommentThunk = createAsyncThunk(
  'threads/neutralVoteComment',
  async ({ threadId, commentId }: { threadId: string; commentId: string }, { rejectWithValue }) => {
    try {
      return await api.neutralVoteComment({ threadId, commentId });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  'threads/createComment',
  async ({ threadId, content }: { threadId: string; content: string }, { rejectWithValue }) => {
    try {
      return await api.createComment({ threadId, content });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const threadSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThreadsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = action.payload;
      })
      .addCase(fetchThreadsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchDetailThreadThunk.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchDetailThreadThunk.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.detailThread = action.payload;
      })
      .addCase(fetchDetailThreadThunk.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createThreadThunk.fulfilled, (state, action) => {
        state.threads = [action.payload, ...state.threads];
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        if (state.detailThread) {
          state.detailThread.comments = [action.payload, ...state.detailThread.comments];
        }
      })
      // Thread Votes
      .addCase(upVoteThreadThunk.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;
        // Update in list
        const thread = state.threads.find(t => t.id === threadId);
        if (thread) {
          if (!thread.upVotesBy.includes(userId)) thread.upVotesBy.push(userId);
          thread.downVotesBy = thread.downVotesBy.filter((id: string) => id !== userId);
        }
        // Update in detail
        if (state.detailThread && state.detailThread.id === threadId) {
          if (!state.detailThread.upVotesBy.includes(userId)) state.detailThread.upVotesBy.push(userId);
          state.detailThread.downVotesBy = state.detailThread.downVotesBy.filter((id: string) => id !== userId);
        }
      })
      .addCase(downVoteThreadThunk.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;
        const thread = state.threads.find(t => t.id === threadId);
        if (thread) {
          if (!thread.downVotesBy.includes(userId)) thread.downVotesBy.push(userId);
          thread.upVotesBy = thread.upVotesBy.filter((id: string) => id !== userId);
        }
        if (state.detailThread && state.detailThread.id === threadId) {
          if (!state.detailThread.downVotesBy.includes(userId)) state.detailThread.downVotesBy.push(userId);
          state.detailThread.upVotesBy = state.detailThread.upVotesBy.filter((id: string) => id !== userId);
        }
      })
      .addCase(neutralVoteThreadThunk.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;
        const thread = state.threads.find(t => t.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id: string) => id !== userId);
          thread.downVotesBy = thread.downVotesBy.filter((id: string) => id !== userId);
        }
        if (state.detailThread && state.detailThread.id === threadId) {
          state.detailThread.upVotesBy = state.detailThread.upVotesBy.filter((id: string) => id !== userId);
          state.detailThread.downVotesBy = state.detailThread.downVotesBy.filter((id: string) => id !== userId);
        }
      })
      // Comment Votes
      .addCase(upVoteCommentThunk.fulfilled, (state, action) => {
        const { commentId, userId } = action.payload;
        if (state.detailThread) {
          const comment = state.detailThread.comments.find((c: any) => c.id === commentId);
          if (comment) {
            if (!comment.upVotesBy.includes(userId)) comment.upVotesBy.push(userId);
            comment.downVotesBy = comment.downVotesBy.filter((id: string) => id !== userId);
          }
        }
      })
      .addCase(downVoteCommentThunk.fulfilled, (state, action) => {
        const { commentId, userId } = action.payload;
        if (state.detailThread) {
          const comment = state.detailThread.comments.find((c: any) => c.id === commentId);
          if (comment) {
            if (!comment.downVotesBy.includes(userId)) comment.downVotesBy.push(userId);
            comment.upVotesBy = comment.upVotesBy.filter((id: string) => id !== userId);
          }
        }
      })
      .addCase(neutralVoteCommentThunk.fulfilled, (state, action) => {
        const { commentId, userId } = action.payload;
        if (state.detailThread) {
          const comment = state.detailThread.comments.find((c: any) => c.id === commentId);
          if (comment) {
            comment.upVotesBy = comment.upVotesBy.filter((id: string) => id !== userId);
            comment.downVotesBy = comment.downVotesBy.filter((id: string) => id !== userId);
          }
        }
      });
  },
});

export default threadSlice.reducer;
