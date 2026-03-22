import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuth from 'expo-local-authentication';
import { useAuthStore } from '../store';
import { NumPad } from '../components/NumPad';
import { colors } from '../theme';

const BG_START = '#25913C';
const BG_END   = '#00DC2F';

export default function UnlockScreen() {
  const [mode, setMode]         = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin]           = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError]       = useState('');
  const { pin: storedPin, unlock } = useAuthStore();

  useEffect(() => { triggerBiometrics(); }, []);

  const triggerBiometrics = async () => {
    const hasHw      = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();
    if (!hasHw || !isEnrolled) return;

    const result = await LocalAuth.authenticateAsync({
      promptMessage:           'ورود به Iran e-ID',
      disableDeviceFallback:   true,
      biometricsSecurityLevel: 'weak',
    });
    if (result.success) unlock();
  };

  const handlePin = (val: string) => {
    if (val === storedPin) { unlock(); return; }
    const a = attempts + 1;
    setAttempts(a);
    setError(a >= 5 ? 'تلاش‌های زیاد. لطفاً صبر کنید.' : `رمز اشتباه. ${5 - a} تلاش باقی مانده.`);
    setPin('');
  };

  // ── PIN fallback ─────────────────────────────────────────────────────
  if (mode === 'pin') {
    return (
      <SafeAreaView style={s.lightSafe}>
        <StatusBar barStyle="dark-content" />
        <Pressable
          onPress={() => { setMode('biometric'); setPin(''); setError(''); }}
          style={s.backRow}
        >
          <Text style={s.backTxt}>← بازگشت</Text>
        </Pressable>
        <Text style={s.pinTitle}>رمز PIN</Text>
        {!!error && <Text style={s.pinError}>{error}</Text>}
        <NumPad value={pin} onChange={setPin} length={6} onComplete={handlePin} />
      </SafeAreaView>
    );
  }

  // ── Biometric screen ──────────────────────────────────────────────────
  return (
    <LinearGradient
      colors={[BG_START, BG_END]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0.35, 1.0]}
      style={s.gradient}
    >
      <View style={s.overlay} />
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={s.safe}>

        {/* Top — logo + heading */}
        <View style={s.top}>
          <Image
            source={require('../../assets/lion-sun-transparent.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.heading}>از تشخیص چهره استفاده کنید</Text>
        </View>

        {/* Middle — face icon */}
        <View style={s.middle}>
          <Pressable onPress={triggerBiometrics}>
            <Image
              source={require('../../assets/face-scan.png')}
              style={s.faceIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Bottom — CTA + fallback link */}
        <View style={s.bottom}>
          <Pressable style={s.bioBtn} onPress={triggerBiometrics}>
            <Text style={s.bioBtnTxt}>ورود با استفاده از تشخیص چهره</Text>
          </Pressable>
          <Pressable onPress={() => setMode('pin')}>
            <Text style={s.altLink}>سایر روش های احراز هویت</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  gradient: { flex: 1 },
  overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(23,23,23,0.57)' },
  safe:     { flex: 1 },

  top: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 44, paddingBottom: 32 },
  logo: { width: 125, height: 90 },
  heading: { color: '#fff', fontSize: 20, fontFamily: 'Vazirmatn-Bold', marginTop: 28, textAlign: 'center' },

  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faceIcon: { width: 140, height: 140 },

  bottom: { paddingHorizontal: 44, paddingBottom: 56, alignItems: 'center', gap: 24 },
  bioBtn: { width: '100%', backgroundColor: '#32BB4F', borderRadius: 37, paddingVertical: 17, alignItems: 'center' },
  bioBtnTxt: { color: '#fff', fontSize: 18, fontFamily: 'Vazirmatn-Bold' },
  altLink:   { color: 'rgba(255,255,255,0.88)', fontSize: 16, fontFamily: 'Vazirmatn-Regular', textDecorationLine: 'underline' },

  lightSafe: { flex: 1, backgroundColor: colors.bg, paddingTop: 20 },
  backRow:   { paddingHorizontal: 20, paddingVertical: 10 },
  backTxt:   { fontSize: 16, color: colors.navy, fontFamily: 'Vazirmatn-Medium' },
  pinTitle:  { fontSize: 22, fontFamily: 'Vazirmatn-Bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  pinError:  { color: colors.red, fontSize: 13, fontFamily: 'Vazirmatn-Medium', textAlign: 'center', marginBottom: 12 },
});
