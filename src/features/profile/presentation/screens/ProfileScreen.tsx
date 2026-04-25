import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import AvatarImage from '../../../../core/components/AvatarImage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { 
  Settings, 
  LogOut, 
  Edit2, 
  Grid, 
  Heart, 
  MessageCircle,
  Award,
  AlertTriangle,
  X
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../../../core/store/slices/authSlice';
import { fetchThreadsThunk } from '../../../../core/store/slices/threadSlice';
import { fetchLeaderboardsThunk } from '../../../../core/store/slices/leaderboardSlice';
import { AppDispatch, RootState } from '../../../../core/store';
import { useMemo } from 'react';
import { getRelativeTime } from '../../../../core/utils/time';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const ProfileStatSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="items-center flex-1">
      <Animated.View style={animatedStyle} className={`w-12 h-12 rounded-2xl mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`} />
      <Animated.View style={animatedStyle} className={`h-5 w-10 rounded-md mb-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`} />
      <Animated.View style={animatedStyle} className={`h-3 w-16 rounded-md ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`} />
    </View>
  );
};

const ProfileStat = ({ label, value, icon: Icon, isDarkMode }: { label: string, value: string, icon: any, isDarkMode: boolean }) => (
  <View className="items-center flex-1">
    <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
      <Icon size={20} color="#7E69FF" />
    </View>
    <Text className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</Text>
    <Text className={`text-xs font-medium uppercase tracking-tighter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</Text>
  </View>
);

const MenuItem = ({ title, icon: Icon, color = "#64748b", onPress, isDarkMode, isExpanded }: { title: string, icon: any, color?: string, onPress?: () => void, isDarkMode: boolean, isExpanded?: boolean }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center p-4 mb-3 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
  >
    <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${color}10` }}>
      <Icon size={20} color={color} />
    </View>
    <Text className={`flex-1 font-semibold text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{title}</Text>
    <View className={`w-8 h-8 rounded-full items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
      <Text 
        style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
        className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}
      >›</Text>
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'none' | 'threads' | 'achievements'>('none');
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { user, status } = useSelector((state: RootState) => state.auth);
  const { threads } = useSelector((state: RootState) => state.threads);
  const { leaderboards } = useSelector((state: RootState) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchThreadsThunk());
    dispatch(fetchLeaderboardsThunk());
  }, [dispatch]);

  const myThreads = useMemo(() => {
    if (!user || !threads.length) return [];
    return threads.filter(t => t.ownerId === user.id);
  }, [threads, user]);

  const userRank = useMemo(() => {
    if (!user || !leaderboards.length) return null;
    const index = leaderboards.findIndex(l => l.user.id === user.id);
    if (index === -1) return null;
    return {
      rank: index + 1,
      score: leaderboards[index].score
    };
  }, [leaderboards, user]);

  const userStats = useMemo(() => {
    if (!user || !threads.length) return { threads: 0, likes: 0, answers: 0 };
    
    const totalLikes = myThreads.reduce((acc, t) => acc + (t.upVotesBy?.length || 0), 0);
    const totalAnswers = myThreads.reduce((acc, t) => acc + (t.totalComments || 0), 0);

    return {
      threads: myThreads.length,
      likes: totalLikes,
      answers: totalAnswers
    };
  }, [myThreads, user, threads.length]);

  const handleLogout = async () => {
    setIsLogoutModalVisible(false);
    await dispatch(logoutThunk());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const isLoading = status === 'loading';

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`} showsVerticalScrollIndicator={false}>
      {/* Header / Cover Area */}
      <View className="h-64">
        <LinearGradient
          colors={['#4A90E2', '#7E69FF', '#D66DFF']}
          className="h-48 rounded-b-[50px] relative"
        >
          <View className="absolute top-14 right-6">
            <TouchableOpacity 
              onPress={() => setIsLogoutModalVisible(true)}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* Profile Info Overlay */}
        <View className="absolute bottom-0 left-0 right-0 items-center">
          <View className="relative">
            <AvatarImage 
              uri={user?.avatar}
              name={user?.name}
              size={128}
              className="border-4 border-white shadow-xl"
            />
            <TouchableOpacity className="absolute bottom-1 right-1 w-10 h-10 bg-[#007AFF] rounded-full items-center justify-center border-4 border-white shadow-lg">
              <Edit2 size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="items-center mt-4 px-6">
        <Text className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'Guest User'}</Text>
        <Text className={`font-bold mt-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>@{user?.id || 'id_not_found'}</Text>
        <Text className={`font-medium mb-6 mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email || 'email@example.com'}</Text>
        
        {/* Stats Card */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          className={`flex-row w-full p-6 rounded-[30px] shadow-sm border mb-8 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
        >
          {isLoading ? (
            <>
              <ProfileStatSkeleton isDarkMode={isDarkMode} />
              <ProfileStatSkeleton isDarkMode={isDarkMode} />
              <ProfileStatSkeleton isDarkMode={isDarkMode} />
            </>
          ) : (
            <>
              <ProfileStat label="Threads" value={userStats.threads.toString()} icon={Grid} isDarkMode={isDarkMode} />
              <ProfileStat label="Likes" value={userStats.likes >= 1000 ? `${(userStats.likes / 1000).toFixed(1)}k` : userStats.likes.toString()} icon={Heart} isDarkMode={isDarkMode} />
              <ProfileStat label="Answers" value={userStats.answers.toString()} icon={MessageCircle} isDarkMode={isDarkMode} />
            </>
          )}
        </Animated.View>

        {/* Menu Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          className="w-full"
        >
          <Text className={`font-bold text-lg mb-4 px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Settings</Text>
          
          {/* My Threads Section */}
          <MenuItem 
            title="My Threads" 
            icon={Grid} 
            color="#7E69FF" 
            isDarkMode={isDarkMode} 
            isExpanded={expandedSection === 'threads'}
            onPress={() => setExpandedSection(prev => prev === 'threads' ? 'none' : 'threads')} 
          />
          {expandedSection === 'threads' && (
            <Animated.View entering={FadeInDown} className="px-2 mb-4">
              {myThreads.length > 0 ? myThreads.map((thread: any) => (
                <TouchableOpacity 
                  key={thread.id}
                  onPress={() => navigation.navigate('DetailThread', { threadId: thread.id })}
                  className={`p-4 rounded-2xl mb-2 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                >
                  <Text className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>{thread.title}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-indigo-500 text-[10px] font-bold uppercase">{thread.category}</Text>
                    <Text className="text-slate-400 text-[10px]">{getRelativeTime(thread.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              )) : (
                <Text className="text-slate-400 text-center py-4">You haven't created any threads yet.</Text>
              )}
            </Animated.View>
          )}

          {/* Achievements Section */}
          <MenuItem 
            title="Achievements" 
            icon={Award} 
            color="#fbbf24" 
            isDarkMode={isDarkMode} 
            isExpanded={expandedSection === 'achievements'}
            onPress={() => setExpandedSection(prev => prev === 'achievements' ? 'none' : 'achievements')} 
          />
          {expandedSection === 'achievements' && (
            <Animated.View entering={FadeInDown} className="px-2 mb-4">
              {userRank ? (
                <View className={`p-6 rounded-[30px] border flex-row items-center ${isDarkMode ? 'bg-amber-900/10 border-amber-500/30' : 'bg-amber-50 border-amber-100'}`}>
                  <View className="w-16 h-16 bg-amber-400 rounded-full items-center justify-center shadow-lg shadow-amber-200">
                    <Text className="text-white font-black text-2xl">#{userRank.rank}</Text>
                  </View>
                  <View className="ml-5 flex-1">
                    <Text className={`font-black text-xl mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>Rank Champion</Text>
                    <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Top Contributors Leaderboard</Text>
                    <Text className="text-indigo-500 font-bold mt-2">{userRank.score} Points Earned</Text>
                  </View>
                </View>
              ) : (
                <Text className="text-slate-400 text-center py-4">No achievements yet. Stay active to climb the ranks!</Text>
              )}
            </Animated.View>
          )}

          <MenuItem title="Logout" icon={LogOut} color="#ef4444" onPress={() => setIsLogoutModalVisible(true)} isDarkMode={isDarkMode} />
        </Animated.View>
      </View>
      
      <View className="h-32" />

      {/* Modern Logout Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/60 justify-center items-center px-6"
          onPress={() => setIsLogoutModalVisible(false)}
        >
          <Animated.View 
            entering={FadeInDown.springify()}
            className={`w-full rounded-[40px] p-8 items-center shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
          >
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <AlertTriangle size={40} color="#ef4444" />
            </View>
            
            <Text className={`text-2xl font-black mb-2 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Wait! Leaving?</Text>
            <Text className={`text-center mb-10 text-base leading-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Are you sure you want to log out? You'll need to sign back in to join the conversation.
            </Text>

            <View className="flex-row w-full gap-4">
              <TouchableOpacity 
                onPress={() => setIsLogoutModalVisible(false)}
                className={`flex-1 py-4 rounded-2xl items-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              >
                <Text className={`font-bold text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-1 bg-red-500 py-4 rounded-2xl items-center shadow-lg shadow-red-200"
              >
                <Text className="text-white font-bold text-lg">Log Out</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => setIsLogoutModalVisible(false)}
              className={`absolute top-6 right-6 w-8 h-8 rounded-full items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}
            >
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
