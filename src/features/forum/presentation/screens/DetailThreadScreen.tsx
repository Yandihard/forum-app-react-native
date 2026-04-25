import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import AvatarImage from '../../../../core/components/AvatarImage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Share2,
  Clock,
  Tag,
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDetailThreadThunk, 
  createCommentThunk,
  upVoteThreadThunk,
  downVoteThreadThunk,
  neutralVoteThreadThunk,
  upVoteCommentThunk,
  downVoteCommentThunk,
  neutralVoteCommentThunk
} from '../../../../core/store/slices/threadSlice';
import { AppDispatch, RootState } from '../../../../core/store';
import { getRelativeTime } from '../../../../core/utils/time';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

const CommentItem = ({ 
  comment, 
  index, 
  threadId,
  onVoteUp,
  onVoteDown,
  onNeutralVote,
  isDarkMode 
}: { 
  comment: any; 
  index: number; 
  threadId: string;
  onVoteUp: () => void;
  onVoteDown: () => void;
  onNeutralVote: () => void;
  isDarkMode: boolean;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isUpvoted = comment.upVotesBy.includes(user?.id);
  const isDownvoted = comment.downVotesBy.includes(user?.id);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      className={`p-4 rounded-2xl mb-3 border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <View className="flex-row items-center mb-2">
        <AvatarImage
          uri={comment.owner.avatar}
          name={comment.owner.name}
          size={32}
          className="border border-[#7E69FF]/30"
        />
        <View className="ml-2 flex-1">
          <Text className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{comment.owner.name}</Text>
          <Text className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{getRelativeTime(comment.createdAt)}</Text>
        </View>
      </View>
      <Text className={`text-sm leading-5 mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{comment.content}</Text>
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={isUpvoted ? onNeutralVote : onVoteUp}
          className="flex-row items-center mr-4"
        >
          <ThumbsUp size={14} color={isUpvoted ? '#3b82f6' : (isDarkMode ? '#94a3b8' : '#64748b')} fill={isUpvoted ? '#3b82f6' : 'none'} />
          <Text className={`ml-1 text-xs ${isUpvoted ? 'text-blue-600 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>{comment.upVotesBy.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={isDownvoted ? onNeutralVote : onVoteDown}
          className="flex-row items-center"
        >
          <ThumbsDown size={14} color={isDownvoted ? '#ef4444' : (isDarkMode ? '#94a3b8' : '#64748b')} fill={isDownvoted ? '#ef4444' : 'none'} />
          <Text className={`ml-1 text-xs ${isDownvoted ? 'text-red-600 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>{comment.downVotesBy.length}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function DetailThreadScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { threadId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const { detailThread, detailStatus } = useSelector((state: RootState) => state.threads);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchDetailThreadThunk(threadId));
  }, [dispatch, threadId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const resultAction = await dispatch(createCommentThunk({ threadId, content: commentText }));
      if (createCommentThunk.fulfilled.match(resultAction)) {
        setCommentText('');
      } else {
        Alert.alert('Error', 'Failed to post comment');
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleThreadVoteUp = () => dispatch(upVoteThreadThunk(threadId));
  const handleThreadVoteDown = () => dispatch(downVoteThreadThunk(threadId));
  const handleThreadNeutralVote = () => dispatch(neutralVoteThreadThunk(threadId));

  const handleCommentVoteUp = (commentId: string) => dispatch(upVoteCommentThunk({ threadId, commentId }));
  const handleCommentVoteDown = (commentId: string) => dispatch(downVoteCommentThunk({ threadId, commentId }));
  const handleCommentNeutralVote = (commentId: string) => dispatch(neutralVoteCommentThunk({ threadId, commentId }));
  
  const handleShare = async () => {
    if (!detailThread) return;
    try {
      await Share.share({
        message: `Check out this thread on Forum App: ${detailThread.title}\n\n${detailThread.body}`,
        title: detailThread.title,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (detailStatus === 'loading' || !detailThread) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <ActivityIndicator size="large" color="#7E69FF" />
        <Text className={`mt-4 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading thread...</Text>
      </View>
    );
  }

  const isThreadUpvoted = detailThread.upVotesBy.includes(user?.id);
  const isThreadDownvoted = detailThread.downVotesBy.includes(user?.id);

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <LinearGradient
        colors={['#4A90E2', '#7E69FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-6 px-6 rounded-b-[40px] shadow-lg z-10"
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <Text className="text-white text-lg font-bold flex-1 text-center px-4" numberOfLines={1}>
            Thread Detail
          </Text>
          
          <TouchableOpacity 
            onPress={handleShare}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Share2 size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Thread Content */}
          <Animated.View 
            entering={FadeIn.duration(600)}
            className={`p-6 rounded-b-[40px] shadow-sm mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
          >
            <View className="flex-row items-center mb-6">
              <AvatarImage
                uri={detailThread.owner.avatar}
                name={detailThread.owner.name}
                size={56}
                className="border-2 border-[#7E69FF]"
              />
              <View className="ml-4 flex-1">
                <Text className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{detailThread.owner.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Clock size={12} color={isDarkMode ? '#94a3b8' : '#94a3b8'} />
                  <Text className={`text-xs ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                    {getRelativeTime(detailThread.createdAt)}
                  </Text>
                </View>
              </View>
              <View className="bg-indigo-50 px-3 py-1 rounded-full flex-row items-center">
                <Tag size={12} color="#6366f1" />
                <Text className="text-[#6366f1] text-[10px] font-bold ml-1 uppercase">
                  {detailThread.category}
                </Text>
              </View>
            </View>

            <Text className={`font-bold text-2xl mb-4 leading-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {detailThread.title}
            </Text>

            <Text className={`text-base leading-7 mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {detailThread.body}
            </Text>

            <View className="flex-row items-center pt-6 border-t border-slate-50">
              <TouchableOpacity 
                onPress={isThreadUpvoted ? handleThreadNeutralVote : handleThreadVoteUp}
                className={`flex-row items-center px-4 py-2 rounded-2xl mr-3 ${isThreadUpvoted ? 'bg-blue-50' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-50')}`}
              >
                <ThumbsUp size={20} color={isThreadUpvoted ? '#3b82f6' : (isDarkMode ? '#94a3b8' : '#64748b')} fill={isThreadUpvoted ? '#3b82f6' : 'none'} />
                <Text className={`ml-2 font-bold ${isThreadUpvoted ? 'text-blue-600' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>{detailThread.upVotesBy.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={isThreadDownvoted ? handleThreadNeutralVote : handleThreadVoteDown}
                className={`flex-row items-center px-4 py-2 rounded-2xl mr-3 ${isThreadDownvoted ? 'bg-red-50' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-50')}`}
              >
                <ThumbsDown size={20} color={isThreadDownvoted ? '#ef4444' : (isDarkMode ? '#94a3b8' : '#64748b')} fill={isThreadDownvoted ? '#ef4444' : 'none'} />
                <Text className={`ml-2 font-bold ${isThreadDownvoted ? 'text-red-600' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>{detailThread.downVotesBy.length}</Text>
              </TouchableOpacity>

              <View className="flex-1" />

              <View className={`flex-row items-center px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                <MessageSquare size={20} color="#6366f1" />
                <Text className="ml-2 text-indigo-600 font-bold">{detailThread.comments.length}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Comments Section */}
          <View className="px-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-[#7E69FF] rounded-full mr-3" />
              <Text className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Comments ({detailThread.comments.length})</Text>
            </View>

            {detailThread.comments.length === 0 ? (
              <View className="items-center justify-center py-12">
                <MessageSquare size={48} color="#cbd5e1" />
                <Text className="text-slate-400 mt-4 font-medium text-center">
                  No comments yet.{"\n"}Be the first to reply!
                </Text>
              </View>
            ) : (
              detailThread.comments.map((comment: any, index: number) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  index={index} 
                  threadId={threadId}
                  onVoteUp={() => handleCommentVoteUp(comment.id)}
                  onVoteDown={() => handleCommentVoteDown(comment.id)}
                  onNeutralVote={() => handleCommentNeutralVote(comment.id)}
                  isDarkMode={isDarkMode}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Comment Input Bar */}
        <View className={`absolute bottom-0 left-0 right-0 border-t p-4 pb-8 flex-row items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/90 border-slate-100'}`}>
          <AvatarImage
            uri={user?.avatar}
            name={user?.name}
            size={40}
            className="mr-3 border border-slate-200"
          />
          <View className={`flex-1 rounded-2xl flex-row items-center px-4 py-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <TextInput
              placeholder="Write a reply..."
              placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              className={`flex-1 text-sm max-h-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            />
            <TouchableOpacity 
              onPress={handlePostComment}
              disabled={submittingComment || !commentText.trim()}
              className={`ml-2 w-8 h-8 rounded-full items-center justify-center ${commentText.trim() ? 'bg-[#7E69FF]' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Send size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
