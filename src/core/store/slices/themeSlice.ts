import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
  status: 'idle' | 'loading';
}

const initialState: ThemeState = {
  isDarkMode: false,
  status: 'idle',
};

export const loadThemeThunk = createAsyncThunk(
  'theme/loadTheme',
  async () => {
    const theme = await AsyncStorage.getItem('themePreference');
    return theme === 'dark';
  }
);

export const toggleThemeThunk = createAsyncThunk(
  'theme/toggleTheme',
  async (_, { getState }) => {
    const state = getState() as { theme: ThemeState };
    const newMode = !state.theme.isDarkMode;
    await AsyncStorage.setItem('themePreference', newMode ? 'dark' : 'light');
    return newMode;
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeThunk.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      })
      .addCase(toggleThemeThunk.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      });
  },
});

export default themeSlice.reducer;
