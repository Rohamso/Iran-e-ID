import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Image, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, withDelay, withTiming, useAnimatedStyle,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../store';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { onboardingDone } = useAuthStore();

  const op = useSharedValue(0);
  const y  = useSharedValue(24);

  useEffect(() => {
    op.value = withDelay(120, withTiming(1, { duration: 600 }));
    y.value  = withDelay(120, withTiming(0, { duration: 600 }));
  }, []);

  const anim = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateY: y.value }],
  }));

  const goNext = () =>
    navigation.navigate(onboardingDone ? 'SetPin' : 'Onboarding');

  return (
    <LinearGradient
      colors={['#25913C', '#00DC2F']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0.35, 1.0]}
      style={s.gradient}
    >
      <View style={s.overlay} />
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={s.safe}>
        <Animated.View style={[s.inner, anim]}>

          {/* Logo + heading */}
          <View style={s.top}>
            <Image
              source={require('../../assets/lion-sun-transparent.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={s.heading}>از تشخیص چهره استفاده کنید</Text>
          </View>

          {/* Face-scan icon */}
          <View style={s.middle}>
            <Pressable onPress={goNext}>
              <Image
                source={require('../../assets/face-scan.png')}
                style={s.faceIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* CTA + link */}
          <View style={s.bottom}>
            <Pressable style={s.btn} onPress={goNext}>
              <Text style={s.btnTxt}>ورود با استفاده از تشخیص چهره</Text>
            </Pressable>
            <Pressable onPress={goNext}>
              <Text style={s.altLink}>سایر روش های احراز هویت</Text>
            </Pressable>
          </View>

        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  gradient: { flex: 1 },
  overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(23,23,23,0.57)' },
  safe:     { flex: 1 },
  inner:    { flex: 1, alignItems: 'center', paddingHorizontal: 44 },

  top: { alignItems: 'center', paddingTop: 72, paddingBottom: 32 },
  logo: { width: 125, height: 90 },
  heading: { color: '#fff', fontSize: 20, fontFamily: 'Vazirmatn-Bold', textAlign: 'center', marginTop: 28 },

  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faceIcon: { width: 140, height: 140 },

  bottom:  { width: '100%', alignItems: 'center', gap: 24, paddingBottom: 56 },
  btn:     { width: '100%', backgroundColor: '#32BB4F', borderRadius: 37, paddingVertical: 17, alignItems: 'center' },
  btnTxt:  { color: '#fff', fontSize: 18, fontFamily: 'Vazirmatn-Bold' },
  altLink: { color: 'rgba(255,255,255,0.88)', fontSize: 16, fontFamily: 'Vazirmatn-Regular', textDecorationLine: 'underline' },
});
