import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import {
  ArrowLeft,
  Send,
  Type,
  Tag,
  AlignLeft,
  AlertCircle,
  X,
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { createThreadThunk } from '../../../../core/store/slices/threadSlice';
import { AppDispatch, RootState } from '../../../../core/store';
import { useSelector } from 'react-redux';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

export default function AddThreadScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    body: '',
  });

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message: string) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCreateThread = async () => {
    if (!formData.title || !formData.category || !formData.body) {
      showAlert('Ups! Mohon isi semua kolom untuk melanjutkan posting thread Anda.');
      return;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(createThreadThunk(formData));
      if (createThreadThunk.fulfilled.match(resultAction)) {
        navigation.goBack();
      } else {
        showAlert('Gagal memposting thread: ' + resultAction.payload);
      }
    } catch (err) {
      showAlert('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <LinearGradient
        colors={['#7E69FF', '#D66DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <Text className="text-white text-xl font-bold">New Thread</Text>
          
          <TouchableOpacity 
            onPress={handleCreateThread}
            disabled={loading}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            className={`p-6 rounded-[30px] shadow-sm border mb-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
          >
            <View className="gap-6">
              {/* Title Input */}
              <View>
                <View className="flex-row items-center mb-2">
                  <Type size={18} color="#6366f1" />
                  <Text className={`ml-2 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Title</Text>
                </View>
                <TextInput
                  placeholder="What's on your mind?"
                  placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  className={`w-full px-4 py-4 border rounded-2xl font-medium ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </View>

              {/* Category Input */}
              <View>
                <View className="flex-row items-center mb-2">
                  <Tag size={18} color="#ec4899" />
                  <Text className={`ml-2 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Category</Text>
                </View>
                <TextInput
                  placeholder="e.g. react, general, help"
                  placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                  value={formData.category}
                  onChangeText={(text) => handleInputChange('category', text)}
                  className={`w-full px-4 py-4 border rounded-2xl font-medium ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </View>

              {/* Body Input */}
              <View>
                <View className="flex-row items-center mb-2">
                  <AlignLeft size={18} color="#8b5cf6" />
                  <Text className={`ml-2 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Content</Text>
                </View>
                <TextInput
                  placeholder="Explain your thread in detail..."
                  placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  value={formData.body}
                  onChangeText={(text) => handleInputChange('body', text)}
                  className={`w-full px-4 py-4 border rounded-2xl font-medium min-h-[200px] ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </View>
            </View>
          </Animated.View>

          <TouchableOpacity
            onPress={handleCreateThread}
            disabled={loading}
            activeOpacity={0.8}
            className="w-full py-4 bg-[#7E69FF] rounded-full shadow-lg items-center justify-center flex-row mb-12"
          >
            <Send size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              {loading ? 'Posting...' : 'Post Thread'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modern Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <Animated.View 
            entering={FadeInUp}
            exiting={FadeOut}
            className={`w-full rounded-[40px] p-8 items-center shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
          >
            <View className="w-20 h-20 bg-amber-50 rounded-full items-center justify-center mb-6">
              <AlertCircle size={48} color="#fbbf24" />
            </View>
            
            <Text className={`text-2xl font-black mb-4 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Perhatian
            </Text>
            
            <Text className={`text-center text-lg leading-6 mb-8 px-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {modalMessage}
            </Text>
            
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className={`w-full py-4 rounded-full items-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-900'}`}
            >
              <Text className="text-white font-bold text-lg">Mengerti</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
