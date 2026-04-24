import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../features/auth/presentation/screens/SignUpScreen';
import LoginScreen from '../features/auth/presentation/screens/LoginScreen';
import SplashScreen from '../features/auth/presentation/screens/SplashScreen';

const Stack = createNativeStackNavigator();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};


