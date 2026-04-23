import { configureStore } from '@reduxjs/toolkit';

// Basic store setup. Features will add their reducers here.
export const store = configureStore({
  reducer: {
    // auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
