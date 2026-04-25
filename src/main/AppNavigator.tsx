import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../features/auth/presentation/screens/SignUpScreen';
import LoginScreen from '../features/auth/presentation/screens/LoginScreen';
import SplashScreen from '../features/auth/presentation/screens/SplashScreen';
import { MainTabs } from './MainTabs';
import AddThreadScreen from '../features/forum/presentation/screens/AddThreadScreen';
import DetailThreadScreen from '../features/forum/presentation/screens/DetailThreadScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  AddThread: undefined;
  DetailThread: { threadId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs as any} 
        />
        <Stack.Screen 
          name="AddThread" 
          component={AddThreadScreen} 
        />
        <Stack.Screen 
          name="DetailThread" 
          component={DetailThreadScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
