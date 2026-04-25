import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '../core/store'; 
import { loadThemeThunk } from '../core/store/slices/themeSlice';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(loadThemeThunk());
  }, [dispatch]);

  return <>{children}</>;
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeInitializer>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeInitializer>
    </ReduxProvider>
  );
};
