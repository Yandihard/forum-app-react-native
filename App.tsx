import React from 'react';
import { Providers } from './src/app/Providers';
import { AppNavigator } from './src/app/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Providers>
      <AppNavigator />
      <StatusBar style="auto" />
    </Providers>
  );
}
