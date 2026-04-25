import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  MessageSquare,
  ThumbsDown,
  Share2,
  Plus,
  Search,
  Bell,
  ThumbsUp,
  X,
  Tag,
  Moon,
  Sun
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../core/store';
import { fetchThreadsThunk, upVoteThreadThunk, downVoteThreadThunk, neutralVoteThreadThunk } from '../../../../core/store/slices/threadSlice';
import { fetchUsersThunk } from '../../../../core/store/slices/userSlice';
import { toggleThemeThunk } from '../../../../core/store/slices/themeSlice';
import { getRelativeTime } from '../../../../core/utils/time';
import AvatarImage from '../../../../core/components/AvatarImage';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const { width } = Dimensions.get('window');

const ThreadSkeleton = () => {
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
    <View className="bg-white p-5 rounded-[30px] mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row items-center mb-4">
        <Animated.View style={animatedStyle} className="w-10 h-10 rounded-full bg-slate-200" />
        <View className="ml-3 flex-1">
          <Animated.View style={animatedStyle} className="h-4 w-24 bg-slate-200 rounded-md mb-2" />
          <Animated.View style={animatedStyle} className="h-3 w-16 bg-slate-200 rounded-md" />
        </View>
      </View>
      <Animated.View style={animatedStyle} className="h-6 w-full bg-slate-200 rounded-md mb-3" />
      <Animated.View style={animatedStyle} className="h-4 w-3/4 bg-slate-200 rounded-md mb-4" />
      <View className="flex-row items-center">
        <Animated.View style={animatedStyle} className="h-8 w-16 bg-slate-200 rounded-xl mr-2" />
        <Animated.View style={animatedStyle} className="h-8 w-16 bg-slate-200 rounded-xl mr-2" />
        <Animated.View style={animatedStyle} className="h-8 w-16 bg-slate-200 rounded-xl" />
      </View>
    </View>
  );
};

const ThreadCard = ({ item, index, onVoteUp, onVoteDown, onNeutralVote, isDarkMode, onShare }: {
  item: any,
  index: number,
  onVoteUp: () => void,
  onVoteDown: () => void,
  onNeutralVote: () => void,
  isDarkMode: boolean,
  onShare: () => void
}) => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const isUpvoted = item.upVotesBy.includes(user?.id);
  const isDownvoted = item.downVotesBy.includes(user?.id);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500).springify()}
      className={`p-5 rounded-[30px] mb-4 border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetailThread', { threadId: item.id })}
      >
        <View className="flex-row items-center mb-4">
          <AvatarImage
            uri={item.avatar}
            name={item.userName}
            size={40}
            className="border-2 border-[#7E69FF]/20"
          />
          <View className="ml-3 flex-1">
            <Text className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.userName}</Text>
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-xs">{getRelativeTime(item.createdAt)}</Text>
              <View className="ml-2 bg-indigo-50 px-2 py-0.5 rounded-full flex-row items-center">
                <Tag size={10} color="#6366f1" />
                <Text className="text-[#6366f1] text-[9px] font-bold ml-1 uppercase">{item.category}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={onShare}
            className={`w-8 h-8 rounded-full items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}
          >
            <Share2 size={16} color={isDarkMode ? '#94a3b8' : '#94a3b8'} />
          </TouchableOpacity>
        </View>

        <Text className={`font-black text-xl mb-2 leading-7 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={2}>
          {item.title}
        </Text>

        <Text className={`text-sm leading-6 mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} numberOfLines={3}>
          {item.body}
        </Text>
      </TouchableOpacity>

      <View className={`flex-row items-center pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
        <TouchableOpacity
          onPress={isUpvoted ? onNeutralVote : onVoteUp}
          className={`flex-row items-center px-3 py-2 rounded-2xl mr-2 ${isUpvoted ? 'bg-blue-50' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-50')}`}
        >
          <ThumbsUp size={18} color={isUpvoted ? '#3b82f6' : (isDarkMode ? '#94a3b8' : '#94a3b8')} fill={isUpvoted ? '#3b82f6' : 'none'} />
          <Text className={`ml-1.5 font-bold text-xs ${isUpvoted ? 'text-blue-600' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>{item.upVotesBy.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isDownvoted ? onNeutralVote : onVoteDown}
          className={`flex-row items-center px-3 py-2 rounded-2xl mr-2 ${isDownvoted ? 'bg-red-50' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-50')}`}
        >
          <ThumbsDown size={18} color={isDownvoted ? '#ef4444' : (isDarkMode ? '#94a3b8' : '#94a3b8')} fill={isDownvoted ? '#ef4444' : 'none'} />
          <Text className={`ml-1.5 font-bold text-xs ${isDownvoted ? 'text-red-600' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>{item.downVotesBy.length}</Text>
        </TouchableOpacity>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => navigation.navigate('DetailThread', { threadId: item.id })}
          className={`flex-row items-center px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}
        >
          <MessageSquare size={18} color="#7E69FF" />
          <Text className="ml-1.5 text-[#7E69FF] font-bold text-xs">{item.totalComments}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function ThreadsScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { threads, status } = useSelector((state: RootState) => state.threads);
  const { users } = useSelector((state: RootState) => state.users);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchThreadsThunk());
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const mappedThreads = useMemo(() => {
    return threads.map((thread) => {
      const owner = users.find((u) => u.id === thread.ownerId);
      return {
        ...thread,
        userName: owner?.name || 'Unknown',
        avatar: owner?.avatar,
        totalComments: thread.totalComments || 0,
      };
    });
  }, [threads, users]);

  const filteredThreads = useMemo(() => {
    if (!searchQuery) return mappedThreads;
    return mappedThreads.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mappedThreads, searchQuery]);

  const onRefresh = () => {
    dispatch(fetchThreadsThunk());
    dispatch(fetchUsersThunk());
  };

  const handleVoteUp = (id: string) => dispatch(upVoteThreadThunk(id));
  const handleVoteDown = (id: string) => dispatch(downVoteThreadThunk(id));
  const handleNeutralVote = (id: string) => dispatch(neutralVoteThreadThunk(id));

  const handleShare = async (thread: any) => {
    try {
      await Share.share({
        message: `Check out this thread on Forum App: ${thread.title}\n\n${thread.body.substring(0, 100)}...`,
        title: thread.title,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Premium Header */}
      <LinearGradient
        colors={['#4A90E2', '#7E69FF', '#D66DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-8 px-6 rounded-b-[45px] shadow-2xl z-20"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white/70 font-medium text-sm">Welcome back,</Text>
            <Text className="text-white text-2xl font-black tracking-tight">{user?.name + ' ✨' || 'Explore Threads'}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsSearchVisible(!isSearchVisible)}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10 mr-2"
            >
              <Search size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => dispatch(toggleThemeThunk())}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10"
            >
              {isDarkMode ? <Sun size={20} color="white" /> : <Moon size={20} color="white" />}
            </TouchableOpacity>
          </View>
        </View>

        {isSearchVisible && (
          <Animated.View 
            entering={FadeInDown.duration(300)}
            className="relative"
          >
            <View className="absolute inset-y-0 left-0 pl-4 flex-row items-center z-10">
              <Search size={20} color="#94a3b8" />
            </View>
            <TextInput
              placeholder="Search topics or categories..."
              placeholderTextColor="#94a3b8"
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium shadow-sm"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex-row items-center z-10"
              >
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        )}
      </LinearGradient>

      {/* List content */}
      <FlatList
        data={status === 'loading' ? [1, 2, 3] : filteredThreads}
        keyExtractor={(item: any, index) => item.id || index.toString()}
        renderItem={({ item, index }) =>
          status === 'loading' ? (
            <ThreadSkeleton />
          ) : (
            <ThreadCard
              item={item}
              index={index}
              onVoteUp={() => handleVoteUp(item.id)}
              onVoteDown={() => handleVoteDown(item.id)}
              onNeutralVote={() => handleNeutralVote(item.id)}
              onShare={() => handleShare(item)}
              isDarkMode={isDarkMode}
            />
          )
        }
        contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={status === 'loading' && threads.length > 0} onRefresh={onRefresh} tintColor="#7E69FF" />
        }
        ListEmptyComponent={
          status !== 'loading' ? (
            <View className="items-center justify-center mt-10">
              <Text className="text-slate-400 font-medium">No threads found</Text>
            </View>
          ) : null
        }
      />

      {/* FAB - Adjusted position to be above the footer */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AddThread')}
        className={`absolute bottom-8 right-6 w-16 h-16 bg-[#7E69FF] rounded-full items-center justify-center shadow-xl border-4 z-50 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
