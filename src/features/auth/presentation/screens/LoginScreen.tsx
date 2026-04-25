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
import Animated, { FadeInDown, FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Apple,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '../../../../core/store/slices/authSlice';
import { AppDispatch, RootState } from '../../../../core/store';

// Register custom components for NativeWind
cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

cssInterop(Animated.View, {
  className: {
    target: 'style',
  },
});

const LoadingOverlay = () => (
  <Animated.View 
    entering={FadeIn} 
    className="absolute inset-0 bg-black/60 items-center justify-center z-[100]"
  >
    <View className="bg-white p-8 rounded-[30px] items-center shadow-2xl">
      <ActivityIndicator size="large" color="#7E69FF" />
      <Text className="mt-4 text-slate-900 font-bold text-lg">Authenticating...</Text>
      <Text className="text-slate-500 text-sm">Please wait a moment</Text>
    </View>
  </Animated.View>
);

const ErrorModal = ({ visible, message, onClose }: { visible: boolean, message: string, onClose: () => void }) => (
  <Modal transparent visible={visible} animationType="none">
    <View className="flex-1 bg-black/50 items-center justify-center p-6">
      <Animated.View 
        entering={FadeInUp.springify()} 
        className="w-full max-w-sm bg-white rounded-[40px] p-8 items-center shadow-2xl"
      >
        <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-6">
          <AlertCircle size={40} color="#ef4444" />
        </View>
        <Text className="text-2xl font-black text-slate-900 mb-2">Login Failed</Text>
        <Text className="text-slate-500 text-center text-lg mb-8">{message}</Text>
        <TouchableOpacity 
          onPress={onClose}
          className="w-full py-4 bg-slate-900 rounded-full"
        >
          <Text className="text-white font-bold text-center text-lg">Try Again</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { status, error: reduxError } = useSelector((state: RootState) => state.auth);
  const isLoading = status === 'loading';
  const error = reduxError;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const resultAction = await dispatch(loginThunk({ email: formData.email, password: formData.password }));
      if (loginThunk.fulfilled.match(resultAction)) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    } catch (err) {
      // Error handled by redux state
    }
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#7E69FF', '#D66DFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
          className="p-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Background decorative circles */}
          <View 
            className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-blue-300 rounded-full opacity-20" 
            pointerEvents="none"
          />
          <View 
            className="absolute bottom-[5%] left-[-10%] w-80 h-80 bg-purple-300 rounded-full opacity-20" 
            pointerEvents="none"
          />

          {/* Header Section */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center mb-8 px-4 z-10"
          >
            <Text className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Welcome Back
            </Text>
            <Text className="text-white/90 text-lg font-light max-w-xs text-center leading-6">
              Sign in to stay connected with your community
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500).springify()}
            className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl z-10"
          >
            <View className="gap-6">
              {/* Email Input */}
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 flex-row items-center z-20">
                  <Mail size={20} color="#94a3b8" />
                </View>
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:border-[#007AFF]"
                />
              </View>

              {/* Password Input */}
              <View className="relative mt-4">
                <View className="absolute inset-y-0 left-0 pl-4 flex-row items-center z-20">
                  <Lock size={20} color="#94a3b8" />
                </View>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:border-[#007AFF]"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex-row items-center z-20"
                >
                  {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={isLoading}
                className="w-full py-4 bg-[#007AFF] rounded-full shadow-lg mt-6"
              >
                <Text className="text-white font-semibold text-center text-lg">
                  {isLoading ? 'Processing...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeIn.delay(600).duration(500)}
            className="mt-8 flex-row items-center z-10"
          >
            <Text className="text-white/90 text-base font-medium">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text className="text-white text-base font-bold underline">
                Register here
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Logo at the bottom */}
          <View className="mt-12 items-center z-10">
            <MessageCircle size={40} color="white" />
            <Text className="text-white font-bold mt-2 text-lg">FORUM APP</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Error Modal */}
      <ErrorModal 
        visible={!!error} 
        message={error || ''} 
        onClose={() => dispatch(clearError())} 
      />
    </LinearGradient>
  );
}

