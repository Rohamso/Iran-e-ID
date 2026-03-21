import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  { emoji: '🪪', title: 'هویت دیجیتال شما', body: 'کارت ملی و گذرنامه ایرانی خود را به صورت امن ذخیره کنید — همیشه در دسترس.', colors: ['#0B2545', '#1A4F8A'] as [string,string] },
  { emoji: '🔐', title: 'رمزگذاری شده و خصوصی', body: 'محافظت شده با رمز PIN و اثر انگشت. اطلاعات شما هرگز از دستگاه شما خارج نمی‌شود.', colors: ['#133A1B', '#1F5C2E'] as [string,string] },
  { emoji: '🗳️', title: 'در رفراندم رای بدهید', body: 'زمانی که ایران رفراندم برگزار کند، دارندگان هویت تایید شده می‌توانند رای خود را به صورت امن ثبت کنند.', colors: ['#5A1010', '#8B1E1E'] as [string,string] },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList>(null);
  const { finishOnboarding } = useAuthStore();

  const next = () => {
    if (idx < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: idx + 1, animated: true });
      setIdx(idx + 1);
    } else {
      finishOnboarding();
      navigation.navigate('SetPin');
    }
  };

  const skip = () => {
    finishOnboarding();
    navigation.navigate('SetPin');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <LinearGradient colors={item.colors} style={[styles.slide, { width }]}>
            <View style={styles.emojiWrap}><Text style={styles.emoji}>{item.emoji}</Text></View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </LinearGradient>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}
        </View>
        <Button label={idx === SLIDES.length - 1 ? 'بریم!' : 'بعدی'} onPress={next} />
        {idx < SLIDES.length - 1 && (
          <Pressable onPress={skip} style={styles.skipWrap}>
            <Text style={styles.skip}>رد کردن</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B2545' },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 200 },
  emojiWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 32, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  emoji: { fontSize: 56 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 28 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 48, gap: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDE3EC' },
  dotActive: { width: 24, backgroundColor: '#0B2545' },
  skipWrap: { alignItems: 'center' },
  skip: { fontSize: 14, color: '#8A95A3', fontWeight: '600' },
});
