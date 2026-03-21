import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withDelay, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  const { onboardingDone } = useAuthStore();

  const logoY = useSharedValue(40);
  const logoOp = useSharedValue(0);
  const textOp = useSharedValue(0);
  const btnOp = useSharedValue(0);

  useEffect(() => {
    logoY.value = withDelay(100, withTiming(0, { duration: 600 }));
    logoOp.value = withDelay(100, withTiming(1, { duration: 600 }));
    textOp.value = withDelay(600, withTiming(1, { duration: 500 }));
    btnOp.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOp.value, transform: [{ translateY: logoY.value }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOp.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOp.value }));

  return (
    <LinearGradient colors={['#0B2545', '#1A4F8A', '#0D3560']} style={styles.bg}>
      <StatusBar barStyle="light-content" />

      <View style={styles.circles}>
        <View style={[styles.circle, { width: 280, height: 280, top: -80, right: -60 }]} />
        <View style={[styles.circle, { width: 180, height: 180, bottom: 120, left: -50 }]} />
      </View>

      <Animated.View style={[styles.center, logoStyle]}>
        <View style={styles.logoRing}>
          <Image
            source={require('../../assets/lion-sun-square.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Iran e-ID</Text>
        <Text style={styles.appNameFa}>هویت دیجیتال ایرانیان</Text>
      </Animated.View>

      <Animated.View style={[styles.middle, textStyle]}>
        <Text style={styles.headline}>هویت دیجیتال امن شما</Text>
        <Text style={styles.sub}>
          کارت ملی و گذرنامه خود را به صورت امن ذخیره کنید.{'\n'}
          در رفراندم تاریخی ایران رای بدهید.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.bottom, btnStyle]}>
        <Button
          label="شروع کنید"
          variant="gold"
          onPress={() => navigation.navigate(onboardingDone ? 'SetPin' : 'Onboarding')}
        />
        <Text style={styles.disclaimer}>اطلاعات شما رمزگذاری شده و فقط روی دستگاه شما ذخیره می‌شود</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, paddingHorizontal: 28, paddingTop: 80, paddingBottom: 52 },
  circles: { ...StyleSheet.absoluteFillObject },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoRing: { width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(201,168,76,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.5)', marginBottom: 24, overflow: 'hidden' },
  logoImg: { width: 110, height: 110 },
  appName: { fontSize: 38, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  appNameFa: { fontSize: 16, color: 'rgba(255,255,255,0.65)', marginTop: 8 },
  middle: { alignItems: 'center', marginBottom: 40 },
  headline: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 10, lineHeight: 26 },
  bottom: { gap: 14 },
  disclaimer: { textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 20 },
});
