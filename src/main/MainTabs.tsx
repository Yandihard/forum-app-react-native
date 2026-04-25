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

import { useSelector } from 'react-redux';
import { RootState } from '../core/store';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          height: Platform.OS === 'ios' ? 88 : 70,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#334155' : '#f1f5f9',
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDarkMode ? 0.2 : 0.05,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#7E69FF',
        tabBarInactiveTintColor: isDarkMode ? '#64748b' : '#94a3b8',
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
