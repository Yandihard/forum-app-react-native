import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, Layout, FadeOutUp } from 'react-native-reanimated';
import { 
  MessageSquare, 
  ThumbsDown, 
  Share2, 
  Plus,
  Search,
  Bell,
  ThumbsUp,
  X
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const { width } = Dimensions.get('window');

const MOCK_THREADS = [
  {
    id: '1',
    author: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=1',
    content: 'Apa pendapat kalian tentang React Native di tahun 2024? Apakah masih worth it untuk dipelajari?',
    category: 'Programming',
    likes: 24,
    dislikes: 2,
    replies: 12,
    time: '2h ago',
  },
  {
    id: '2',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?u=2',
    content: 'Baru saja mencoba NativeWind v4, stylingnya kerasa jauh lebih smooth dibanding versi sebelumnya! 🔥',
    category: 'UI/UX',
    likes: 45,
    dislikes: 0,
    replies: 8,
    time: '4h ago',
  },
  {
    id: '3',
    author: 'David Miller',
    avatar: 'https://i.pravatar.cc/150?u=3',
    content: 'Ada yang punya tips untuk optimasi performa FlatList dengan ribuan item?',
    category: 'Optimization',
    likes: 12,
    dislikes: 5,
    replies: 20,
    time: '6h ago',
  },
  {
    id: '4',
    author: 'Jessica Lee',
    avatar: 'https://i.pravatar.cc/150?u=4',
    content: 'Design system yang bagus itu kuncinya ada di konsistensi dan dokumentasi yang jelas.',
    category: 'Design',
    likes: 89,
    dislikes: 1,
    replies: 15,
    time: '1d ago',
  },
];

const ThreadCard = ({ item, index }: { item: typeof MOCK_THREADS[0], index: number }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100).duration(500).springify()}
    layout={Layout.springify()}
    className="bg-white/90 m-4 p-5 rounded-[30px] shadow-sm border border-white/50"
  >
    <View className="flex-row items-center mb-4">
      <Image 
        source={{ uri: item.avatar }} 
        className="w-12 h-12 rounded-full border-2 border-[#7E69FF]"
      />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-slate-900 text-lg">{item.author}</Text>
        <Text className="text-slate-500 text-xs">{item.time} • {item.category}</Text>
      </View>
      <TouchableOpacity className="p-2 bg-slate-100 rounded-full">
        <Share2 size={18} color="#64748b" />
      </TouchableOpacity>
    </View>

    <Text className="text-slate-800 text-base leading-6 mb-5">
      {item.content}
    </Text>

    <View className="flex-row items-center pt-4 border-t border-slate-100">
      <TouchableOpacity className="flex-row items-center mr-4">
        <ThumbsUp size={20} color="#007AFF" />
        <Text className="ml-2 text-slate-600 font-medium">{item.likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center mr-6">
        <ThumbsDown size={20} color="#ef4444" />
        <Text className="ml-2 text-slate-600 font-medium">{item.dislikes}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row items-center">
        <MessageSquare size={20} color="#6366f1" />
        <Text className="ml-2 text-slate-600 font-medium">{item.replies}</Text>
      </TouchableOpacity>

      <View className="flex-1" />
      
      <TouchableOpacity className="px-4 py-2 bg-[#7E69FF] rounded-full">
        <Text className="text-white text-xs font-bold">Reply</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export default function ThreadsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const filteredThreads = useMemo(() => {
    if (!searchQuery) return MOCK_THREADS;
    return MOCK_THREADS.filter(thread => 
      thread.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient
        colors={['#4A90E2', '#7E69FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-center mb-6">
          {!isSearchVisible ? (
            <Animated.View entering={FadeInDown} className="flex-1">
              <Text className="text-white/80 text-sm font-medium">{getGreeting()},</Text>
              <Text className="text-white text-2xl font-bold">Audrey ✨</Text>
            </Animated.View>
          ) : (
            <Animated.View 
              entering={FadeInDown} 
              className="flex-1 bg-white/20 rounded-2xl flex-row items-center px-4 py-2 mr-4"
            >
              <Search size={20} color="white" />
              <TextInput
                placeholder="Search threads..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                className="flex-1 ml-2 text-white font-medium"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="white" />
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => {
                setIsSearchVisible(!isSearchVisible);
                if (isSearchVisible) setSearchQuery('');
              }}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              {isSearchVisible ? <X size={20} color="white" /> : <Search size={20} color="white" />}
            </TouchableOpacity>
            {!isSearchVisible && (
              <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <Bell size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {filteredThreads.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Search size={64} color="#cbd5e1" />
          <Text className="text-slate-400 text-lg font-medium mt-4 text-center">
            No threads found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredThreads}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ThreadCard item={item} index={index} />}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute bottom-6 right-6 w-16 h-16 bg-[#D66DFF] rounded-full items-center justify-center shadow-xl border-4 border-white"
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
