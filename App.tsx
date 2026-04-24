import "./global.css";
import React from 'react';
import { Providers } from './src/main/Providers';
import { AppNavigator } from './src/main/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Providers>
      <AppNavigator />
      <StatusBar style="auto" />
    </Providers>
  );
}
