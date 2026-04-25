import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { initAuthThunk } from '../../../../core/store/slices/authSlice';
import { AppDispatch } from '../../../../core/store';

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

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Animation sequence
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1, { damping: 12 });

    const initAuth = async () => {
      try {
        const resultAction = await dispatch(initAuthThunk());
        if (initAuthThunk.fulfilled.match(resultAction) && resultAction.payload.token) {
          setTimeout(() => {
            navigation.replace('MainTabs');
          }, 2500);
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 2500);
        }
      } catch (err) {
        setTimeout(() => {
          navigation.replace('Login');
        }, 2500);
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <LinearGradient
      colors={['#4A90E2', '#7E69FF', '#D66DFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <Animated.View 
        entering={FadeIn.duration(1000)}
        style={animatedStyle}
        className="items-center"
      >
        <View className="bg-white/20 p-8 rounded-[50px] shadow-2xl">
          <MessageCircle size={100} color="white" />
        </View>
        <Text className="text-white text-5xl font-black mt-6 tracking-tighter">
          FORUM APP
        </Text>
        <Text className="text-white/70 text-lg font-light mt-2 tracking-[10px]">
          CONNECT
        </Text>
      </Animated.View>

      {/* Decorative background elements consistent with other screens */}
      <View 
        className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-blue-300 rounded-full opacity-20" 
        pointerEvents="none"
      />
      <View 
        className="absolute bottom-[5%] left-[-10%] w-80 h-80 bg-purple-300 rounded-full opacity-20" 
        pointerEvents="none"
      />
    </LinearGradient>
  );
}
