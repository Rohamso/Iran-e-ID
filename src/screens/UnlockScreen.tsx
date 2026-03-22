import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  Pressable, Image, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuth from 'expo-local-authentication';
import { useAuthStore } from '../store';
import { NumPad } from '../components/NumPad';
import { colors } from '../theme';

const BG_TOP = '#1B4D20';
const BG_BOT = '#0A2810';

export default function UnlockScreen() {
  const [mode, setMode]       = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin]         = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError]     = useState('');
  const { pin: storedPin, unlock } = useAuthStore();

  useEffect(() => { triggerBiometrics(); }, []);

  const triggerBiometrics = async () => {
    const hasHw      = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();
    if (!hasHw || !isEnrolled) return;

    const result = await LocalAuth.authenticateAsync({
      promptMessage:          'ورود به Iran e-ID',
      disableDeviceFallback:  true,
      biometricsSecurityLevel: 'weak', // includes Android face unlock
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

  // ── PIN fallback ────────────────────────────────────────────────────
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

  // ── Biometric screen (matches design) ────────────────────────────────
  return (
    <LinearGradient colors={[BG_TOP, BG_BOT]} style={s.gradient}>
      <StatusBar barStyle="light-content" backgroundColor={BG_TOP} />
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

        {/* Middle — face icon (tappable, re-triggers biometrics) */}
        <View style={s.middle}>
          <Pressable onPress={triggerBiometrics} style={s.faceCircle}>
            {/* Eyes */}
            <View style={s.eyeRow}>
              <View style={s.eye} />
              <View style={s.eye} />
            </View>
            {/* Smile */}
            <View style={s.smile} />
          </Pressable>
        </View>

        {/* Bottom — CTA button + fallback link */}
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
  safe:     { flex: 1 },

  // Top
  top: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 40 },
  logo: { width: 150, height: 150 },
  heading: {
    color: '#fff', fontSize: 16, fontWeight: '500',
    marginTop: 22, textAlign: 'center', lineHeight: 24,
  },

  // Middle — face icon
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faceCircle: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center', alignItems: 'center',
    gap: 12,
  },
  eyeRow: { flexDirection: 'row', gap: 20 },
  eye:    { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  smile:  {
    width: 30, height: 15,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#fff',
  },

  // Bottom
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 52,
    alignItems: 'center',
    gap: 22,
  },
  bioBtn: {
    width: '100%',
    backgroundColor: '#2E6E32',
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
  },
  bioBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  altLink:   {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // PIN fallback
  lightSafe: { flex: 1, backgroundColor: colors.bg, paddingTop: 20 },
  backRow:   { paddingHorizontal: 20, paddingVertical: 10 },
  backTxt:   { fontSize: 16, color: colors.navy, fontWeight: '600' },
  pinTitle:  {
    fontSize: 22, fontWeight: '800', color: colors.text,
    textAlign: 'center', marginBottom: 8,
  },
  pinError:  {
    color: colors.red, fontSize: 13, fontWeight: '600',
    textAlign: 'center', marginBottom: 12,
  },
});
