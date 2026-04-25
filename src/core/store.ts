import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import threadReducer from './store/slices/threadSlice';
import userReducer from './store/slices/userSlice';
import leaderboardReducer from './store/slices/leaderboardSlice';
import themeReducer from './store/slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
    users: userReducer,
    leaderboards: leaderboardReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
