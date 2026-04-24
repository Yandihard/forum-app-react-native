import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Apple,
  MessageCircle,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

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

cssInterop(Animated.Text, {
  className: {
    target: 'style',
  },
});

const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              Join the Community
            </Text>
            <Text className="text-white/90 text-lg font-light max-w-xs text-center leading-6">
              Connect, share, and engage with passionate individuals.
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500).springify()}
            className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl z-10"
          >
            <View className="gap-6">
              {/* Full Name Input */}
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 flex-row items-center z-20">
                  <User size={20} color="#94a3b8" />
                </View>
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#94a3b8"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:border-[#007AFF]"
                />
              </View>

              {/* Email Input */}
              <View className="relative mt-4">
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
                className="w-full py-4 bg-[#007AFF] rounded-full shadow-lg mt-6"
              >
                <Text className="text-white font-semibold text-center text-lg">
                  Create Account
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
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-white text-base font-bold underline">
                Sign In here
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
    </LinearGradient>
  );
}


