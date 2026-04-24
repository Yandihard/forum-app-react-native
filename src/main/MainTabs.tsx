import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  MessageSquare, 
  Trophy, 
  User 
} from 'lucide-react-native';
import { View, Platform } from 'react-native';
import ThreadsScreen from '../features/forum/presentation/screens/ThreadsScreen';
import LeaderboardScreen from '../features/forum/presentation/screens/LeaderboardScreen';
import ProfileScreen from '../features/profile/presentation/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 25,
          height: 70,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#7E69FF',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Threads"
        component={ThreadsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View 
              className={`p-2 rounded-2xl ${focused ? 'bg-[#7E69FF]/10 scale-110' : ''}`}
            >
              <MessageSquare 
                size={24} 
                color={focused ? '#7E69FF' : '#94a3b8'} 
                fill={focused ? '#7E69FF' : 'none'} 
                opacity={focused ? 1 : 0.6}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View 
              className={`p-2 rounded-2xl ${focused ? 'bg-[#7E69FF]/10 scale-110' : ''}`}
            >
              <Trophy 
                size={24} 
                color={focused ? '#7E69FF' : '#94a3b8'} 
                fill={focused ? '#7E69FF' : 'none'} 
                opacity={focused ? 1 : 0.6}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View 
              className={`p-2 rounded-2xl ${focused ? 'bg-[#7E69FF]/10 scale-110' : ''}`}
            >
              <User 
                size={24} 
                color={focused ? '#7E69FF' : '#94a3b8'} 
                fill={focused ? '#7E69FF' : 'none'} 
                opacity={focused ? 1 : 0.6}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
