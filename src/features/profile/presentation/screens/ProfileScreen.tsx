import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  Settings, 
  LogOut, 
  Edit2, 
  Grid, 
  Heart, 
  MessageCircle,
  Award
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const ProfileStat = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
  <View className="items-center flex-1">
    <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center mb-2">
      <Icon size={20} color="#7E69FF" />
    </View>
    <Text className="text-slate-900 font-bold text-lg">{value}</Text>
    <Text className="text-slate-500 text-xs font-medium uppercase tracking-tighter">{label}</Text>
  </View>
);

const MenuItem = ({ title, icon: Icon, color = "#64748b", onPress }: { title: string, icon: any, color?: string, onPress?: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center p-4 bg-white mb-3 rounded-2xl border border-slate-100 shadow-sm"
  >
    <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${color}10` }}>
      <Icon size={20} color={color} />
    </View>
    <Text className="flex-1 text-slate-700 font-semibold text-base">{title}</Text>
    <View className="w-8 h-8 bg-slate-50 rounded-full items-center justify-center">
      <Text className="text-slate-400 font-bold">›</Text>
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Header / Cover Area */}
      <View className="h-64">
        <LinearGradient
          colors={['#4A90E2', '#7E69FF', '#D66DFF']}
          className="h-48 rounded-b-[50px] relative"
        >
          <View className="absolute top-14 left-6 right-6 flex-row justify-between items-center">
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Settings size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* Profile Info Overlay */}
        <View className="absolute bottom-0 left-0 right-0 items-center">
          <View className="relative">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=a' }} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />
            <TouchableOpacity className="absolute bottom-1 right-1 w-10 h-10 bg-[#007AFF] rounded-full items-center justify-center border-4 border-white shadow-lg">
              <Edit2 size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="items-center mt-4 px-6">
        <Text className="text-2xl font-black text-slate-900">Audrey Amelia</Text>
        <Text className="text-slate-500 font-medium mb-6">@audrey.amelia • UI/UX Designer</Text>
        
        {/* Stats Card */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          className="flex-row w-full bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 mb-8"
        >
          <ProfileStat label="Threads" value="42" icon={Grid} />
          <ProfileStat label="Likes" value="1.2k" icon={Heart} />
          <ProfileStat label="Answers" value="89" icon={MessageCircle} />
        </Animated.View>

        {/* Menu Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          className="w-full"
        >
          <Text className="text-slate-900 font-bold text-lg mb-4 px-2">Account Settings</Text>
          <MenuItem title="My Threads" icon={Grid} color="#7E69FF" />
          <MenuItem title="Achievements" icon={Award} color="#fbbf24" />
          <MenuItem title="Edit Profile" icon={Edit2} color="#007AFF" />
          <MenuItem title="Logout" icon={LogOut} color="#ef4444" onPress={handleLogout} />
        </Animated.View>
      </View>
      
      <View className="h-24" />
    </ScrollView>
  );
}
