import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  RefreshControl,
  StatusBar
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
import { Trophy, Award, TrendingUp } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../core/store';
import { fetchLeaderboardsThunk } from '../../../../core/store/slices/leaderboardSlice';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const LeaderboardSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
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
    <View className={`flex-row items-center p-4 rounded-3xl mb-3 border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <Animated.View style={animatedStyle} className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <Animated.View style={animatedStyle} className={`w-12 h-12 rounded-full ml-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <View className="ml-4 flex-1">
        <Animated.View style={animatedStyle} className={`h-4 w-32 rounded-md ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </View>
      <Animated.View style={animatedStyle} className={`h-6 w-12 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
    </View>
  );
};

const LeaderboardItem = ({ item, index, isDarkMode }: { item: any, index: number, isDarkMode: boolean }) => {
  const isTopThree = index < 3;
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500).springify()}
      className={`flex-row items-center p-4 rounded-3xl mb-3 border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <View className={`w-8 h-8 rounded-full items-center justify-center ${isTopThree ? 'bg-amber-100' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-100')}`}>
        <Text className={`font-bold ${isTopThree ? 'text-amber-600' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>{index + 1}</Text>
      </View>
      
      <AvatarImage 
        uri={item.user.avatar}
        name={item.user.name}
        size={48}
        className="ml-4 border-2 border-slate-50"
      />
      
      <View className="ml-4 flex-1">
        <Text className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>{item.user.name}</Text>
      </View>
      
      <View className={`px-4 py-2 rounded-2xl flex-row items-center ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
        <Award size={16} color="#7E69FF" />
        <Text className="text-[#7E69FF] font-black ml-1.5">{item.score}</Text>
      </View>
    </Animated.View>
  );
};

export default function LeaderboardScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { leaderboards, status } = useSelector((state: RootState) => state.leaderboards);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchLeaderboardsThunk());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchLeaderboardsThunk());
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-8 px-6 rounded-b-[45px] shadow-2xl z-10"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white/80 font-medium text-sm">Global Rankings</Text>
            <Text className="text-white text-2xl font-black tracking-tight">Leaderboard</Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30">
            <Trophy size={24} color="white" />
          </View>
        </View>
        
        <View className="flex-row items-center bg-white/20 p-4 rounded-2xl">
          <TrendingUp size={20} color="white" />
          <Text className="text-white font-bold ml-3">Top contributors this week</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={status === 'loading' ? [1, 2, 3, 4, 5, 6] : leaderboards}
        keyExtractor={(item: any, index) => item.user?.id || index.toString()}
        renderItem={({ item, index }) => 
          status === 'loading' ? (
            <LeaderboardSkeleton isDarkMode={isDarkMode} />
          ) : (
            <LeaderboardItem item={item} index={index} isDarkMode={isDarkMode} />
          )
        }
        contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={status === 'loading' && leaderboards.length > 0} onRefresh={onRefresh} tintColor="#FFA500" />
        }
      />
    </View>
  );
}
