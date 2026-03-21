import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import * as LocalAuth from 'expo-local-authentication';
import { NumPad } from '../components/NumPad';
import { useAuthStore } from '../store';
import { colors } from '../theme';

export default function UnlockScreen() {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const { pin: storedPin, biometricsEnabled, unlock } = useAuthStore();

  useEffect(() => {
    if (biometricsEnabled) tryBiometrics();
  }, []);

  const tryBiometrics = async () => {
    const result = await LocalAuth.authenticateAsync({ promptMessage: 'باز کردن Iran e-ID' });
    if (result.success) unlock();
  };

  const handleDone = (val: string) => {
    if (val === storedPin) {
      unlock();
    } else {
      const a = attempts + 1;
      setAttempts(a);
      setError(a >= 5 ? 'تلاش‌های زیاد. لطفاً صبر کنید.' : `رمز اشتباه. ${5 - a} تلاش باقی مانده.`);
      setPin('');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.logoWrap}>
          <Image source={require('../../assets/lion-sun-square.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Iran e-ID</Text>
        <Text style={styles.sub}>رمز PIN را برای ورود وارد کنید</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <NumPad value={pin} onChange={setPin} length={6} onComplete={handleDone} />
      {biometricsEnabled && (
        <Pressable onPress={tryBiometrics} style={styles.bioBtn}>
          <Text style={styles.bioIcon}>👆</Text>
          <Text style={styles.bioTxt}>ورود با بیومتریک</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { alignItems: 'center', paddingTop: 40, paddingBottom: 36, paddingHorizontal: 32 },
  logoWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  logo: { width: 72, height: 72 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { fontSize: 15, color: colors.textSub, marginTop: 6 },
  error: { fontSize: 13, color: colors.red, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  bioBtn: { alignItems: 'center', marginTop: 20, gap: 6 },
  bioIcon: { fontSize: 28 },
  bioTxt: { fontSize: 14, color: colors.navy, fontWeight: '600' },
});
