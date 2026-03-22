import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumPad } from '../components/NumPad';
import { useAuthStore } from '../store';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SetPin'>;

export default function SetPinScreen({ navigation }: Props) {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [first, setFirst] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { setPin: savePin } = useAuthStore();

  const handleDone = (val: string) => {
    if (step === 'create') {
      setFirst(val);
      setPin('');
      setStep('confirm');
    } else if (val === first) {
      savePin(val);
    } else {
      setError('رمزها مطابقت ندارند. لطفاً دوباره امتحان کنید.');
      setPin('');
      setFirst('');
      setStep('create');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{step === 'create' ? 'ساخت رمز PIN' : 'تایید رمز PIN'}</Text>
        <Text style={styles.sub}>
          {step === 'create' ? 'یک رمز ۶ رقمی برای محافظت از اطلاعات هویتی خود انتخاب کنید' : 'همان رمز را دوباره وارد کنید تا تایید شود'}
        </Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <NumPad value={pin} onChange={setPin} length={6} onComplete={handleDone} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 48, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sub: { fontSize: 15, color: colors.textSub, textAlign: 'center', marginTop: 10, lineHeight: 24 },
  error: { fontSize: 14, color: colors.red, fontWeight: '600', marginTop: 12, textAlign: 'center' },
});
