import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Trophy, Medal, Crown } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const MOCK_LEADERS = [
  { id: '1', name: 'Audrey', points: 2450, avatar: 'https://i.pravatar.cc/150?u=a', rank: 1 },
  { id: '2', name: 'Zack S.', points: 2100, avatar: 'https://i.pravatar.cc/150?u=b', rank: 2 },
  { id: '3', name: 'Luna Love', points: 1950, avatar: 'https://i.pravatar.cc/150?u=c', rank: 3 },
  { id: '4', name: 'Mike Ross', points: 1800, avatar: 'https://i.pravatar.cc/150?u=d', rank: 4 },
  { id: '5', name: 'Harvey Specter', points: 1750, avatar: 'https://i.pravatar.cc/150?u=e', rank: 5 },
  { id: '6', name: 'Donna Paulsen', points: 1600, avatar: 'https://i.pravatar.cc/150?u=f', rank: 6 },
  { id: '7', name: 'Louis Litt', points: 1400, avatar: 'https://i.pravatar.cc/150?u=g', rank: 7 },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown size={24} color="#fbbf24" fill="#fbbf24" />;
  if (rank === 2) return <Medal size={24} color="#94a3b8" fill="#94a3b8" />;
  if (rank === 3) return <Medal size={24} color="#b45309" fill="#b45309" />;
  return (
    <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
      <Text className="text-slate-500 font-bold">{rank}</Text>
    </View>
  );
};

const LeaderItem = ({ item, index }: { item: typeof MOCK_LEADERS[0], index: number }) => (
  <Animated.View
    entering={FadeInRight.delay(index * 100).duration(500)}
    className="flex-row items-center bg-white mx-4 my-2 p-4 rounded-2xl shadow-sm border border-slate-100"
  >
    <View className="w-10 items-center">
      <RankBadge rank={item.rank} />
    </View>
    
    <Image 
      source={{ uri: item.avatar }} 
      className="w-12 h-12 rounded-full mx-3"
    />
    
    <View className="flex-1">
      <Text className="text-slate-900 font-bold text-base">{item.name}</Text>
      <Text className="text-slate-500 text-xs">Community Champion</Text>
    </View>

    <View className="items-end">
      <Text className="text-[#7E69FF] font-bold text-lg">{item.points.toLocaleString()}</Text>
      <Text className="text-slate-400 text-[10px] uppercase font-bold">Points</Text>
    </View>
  </Animated.View>
);

export default function LeaderboardScreen() {
  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient
        colors={['#7E69FF', '#D66DFF']}
        className="pt-14 pb-12 px-6 rounded-b-[50px]"
      >
        <View className="flex-row items-center justify-center mb-8">
          <Trophy size={28} color="white" />
          <Text className="text-white text-2xl font-black ml-3 tracking-wider">LEADERBOARD</Text>
        </View>

        <View className="flex-row justify-around items-end mb-4">
          {/* 2nd Place */}
          <View className="items-center">
            <View className="relative">
              <Image source={{ uri: MOCK_LEADERS[1].avatar }} className="w-16 h-16 rounded-full border-4 border-slate-300" />
              <View className="absolute -bottom-2 -right-2 bg-slate-300 w-7 h-7 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xs">2</Text>
              </View>
            </View>
            <Text className="text-white font-bold mt-3">{MOCK_LEADERS[1].name}</Text>
            <Text className="text-white/80 text-xs">{MOCK_LEADERS[1].points} pts</Text>
          </View>

          {/* 1st Place */}
          <View className="items-center -top-4">
            <View className="relative">
              <Crown size={32} color="#fbbf24" fill="#fbbf24" className="absolute -top-8 self-center" />
              <Image source={{ uri: MOCK_LEADERS[0].avatar }} className="w-24 h-24 rounded-full border-4 border-yellow-400" />
              <View className="absolute -bottom-2 -right-2 bg-yellow-400 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
            </View>
            <Text className="text-white font-black mt-3 text-lg">{MOCK_LEADERS[0].name}</Text>
            <Text className="text-white/90 text-sm font-bold">{MOCK_LEADERS[0].points} pts</Text>
          </View>

          {/* 3rd Place */}
          <View className="items-center">
            <View className="relative">
              <Image source={{ uri: MOCK_LEADERS[2].avatar }} className="w-16 h-16 rounded-full border-4 border-amber-600" />
              <View className="absolute -bottom-2 -right-2 bg-amber-600 w-7 h-7 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xs">3</Text>
              </View>
            </View>
            <Text className="text-white font-bold mt-3">{MOCK_LEADERS[2].name}</Text>
            <Text className="text-white/80 text-xs">{MOCK_LEADERS[2].points} pts</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={MOCK_LEADERS.slice(3)}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <LeaderItem item={item} index={index} />}
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
