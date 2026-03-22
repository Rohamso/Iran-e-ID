import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReferendumStore, useIdentityStore } from '../store';
import { Button } from '../components/Button';
import { colors, radius, shadow, space } from '../theme';
import { receiptId } from '../helpers';
import type { VoteChoice } from '../types';

const OPTIONS: { id: VoteChoice; emoji: string; title: string; titleFa: string; desc: string }[] = [
  { id: 'monarchy', emoji: '👑', title: 'مشروطه سلطنتی', titleFa: 'Constitutional Monarchy', desc: 'یک سیستم مشروطه با پادشاه به عنوان رئیس کشور، با اختیارات محدود به قانون.' },
  { id: 'republic', emoji: '🏛️', title: 'جمهوری', titleFa: 'Republic', desc: 'یک جمهوری دموکراتیک که رئیس کشور توسط مردم انتخاب می‌شود.' },
];

export default function VoteScreen() {
  const { choice, status, receipt, selectChoice, submitVote, confirmVote } = useReferendumStore();
  const { idCard } = useIdentityStore();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const voted = status === 'done';
  const hasId = !!idCard;

  const handleVote = () => {
    if (!hasId) {
      Alert.alert('مدرک هویتی لازم است', 'قبل از رای دادن باید کارت ملی خود را اضافه کنید.');
      return;
    }
    setConfirming(true);
  };

  const handleConfirm = async () => {
    setConfirming(false);
    setLoading(true);
    submitVote();
    await new Promise(r => setTimeout(r, 2200));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confirmVote({ id: receiptId(), choice: choice!, timestamp: Date.now() });
    setLoading(false);
  };

  // Voted — show receipt
  if (voted && receipt) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.successWrap}>
            <View style={styles.successIcon}><Text style={{ fontSize: 44 }}>✅</Text></View>
            <Text style={styles.successTitle}>رای ثبت شد</Text>
            <Text style={styles.successSub}>رای شما به صورت امن ثبت شده است.</Text>
            <View style={styles.receiptCard}>
              <View style={styles.receiptHdr}>
                <Text style={styles.receiptLabel}>رسید رای</Text>
                <Text style={styles.receiptVerified}>✓ تایید شده</Text>
              </View>
              <View style={styles.receiptDivider} />
              <ReceiptRow k="شناسه رسید" v={receipt.id} />
              <ReceiptRow k="رای شما" v={OPTIONS.find(o => o.id === receipt.choice)?.title ?? ''} highlight />
              <ReceiptRow k="زمان" v={new Date(receipt.timestamp).toLocaleString('fa-IR')} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Submitting
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={{ fontSize: 56, marginBottom: 20 }}>🔐</Text>
          <Text style={styles.loadingTitle}>در حال امن‌سازی رای شما</Text>
          <Text style={styles.loadingSub}>لطفاً صبر کنید…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#5A1010', '#8B1E1E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
          <Text style={{ fontSize: 32 }}>🗳️</Text>
          <View>
            <Text style={styles.bannerTitle}>رفراندم ایران</Text>
            <Text style={styles.bannerFa}>Iran Referendum</Text>
          </View>
        </LinearGradient>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLbl}>سوال رفراندم</Text>
          <Text style={styles.question}>شکل حکومت ایران چه باشد؟</Text>
          <Text style={styles.questionFa}>What form of government should Iran have?</Text>
        </View>

        {/* Eligibility */}
        <View style={styles.eligCard}>
          <Text style={styles.eligTitle}>شرایط رای دادن</Text>
          {[
            { ok: hasId, txt: 'کارت ملی ایرانی اضافه شده' },
            { ok: true,  txt: 'یک رای برای هر نفر' },
            { ok: true,  txt: 'ناشناس و رمزنگاری شده' },
          ].map((row, i) => (
            <View key={i} style={styles.eligRow}>
              <Text style={[styles.eligIcon, row.ok ? styles.eligOk : styles.eligNo]}>{row.ok ? '✓' : '○'}</Text>
              <Text style={[styles.eligTxt, !row.ok && { color: colors.textMuted }]}>{row.txt}</Text>
            </View>
          ))}
        </View>

        {/* Options */}
        <Text style={styles.sectionTitle}>گزینه خود را انتخاب کنید</Text>
        {OPTIONS.map(opt => <OptionCard key={opt.id} opt={opt} selected={choice === opt.id} onSelect={() => { selectChoice(opt.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />)}

        {/* Vote button */}
        <Button
          label={hasId ? 'ثبت رای' : 'افزودن کارت ملی برای رای'}
          variant={choice ? 'danger' : 'outline'}
          disabled={!choice || !hasId}
          onPress={handleVote}
        />
        <Text style={styles.legal}>رای شما قطعی و رمزنگاری شده است.</Text>
      </ScrollView>

      {/* Confirm modal */}
      {confirming && (
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setConfirming(false)} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>تایید رای شما</Text>
            <Text style={styles.sheetSub}>این عمل قابل بازگشت نیست.</Text>
            <View style={styles.sheetOption}>
              <Text style={{ fontSize: 28 }}>{OPTIONS.find(o => o.id === choice)?.emoji}</Text>
              <View>
                <Text style={styles.sheetOptTitle}>{OPTIONS.find(o => o.id === choice)?.title}</Text>
                <Text style={styles.sheetOptFa}>{OPTIONS.find(o => o.id === choice)?.titleFa}</Text>
              </View>
            </View>
            <View style={styles.sheetWarn}>
              <Text style={styles.sheetWarnTxt}>⚠️ پس از ارسال، رای شما قابل تغییر نیست.</Text>
            </View>
            <View style={styles.sheetBtns}>
              <Button label="انصراف" variant="outline" onPress={() => setConfirming(false)} />
              <Button label="تایید رای" variant="danger" onPress={handleConfirm} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function OptionCard({ opt, selected, onSelect }: { opt: typeof OPTIONS[0]; selected: boolean; onSelect: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={anim}>
      <Pressable
        style={[styles.optCard, selected && styles.optCardOn]}
        onPress={() => { scale.value = withSpring(0.97, {}, () => { scale.value = withSpring(1); }); onSelect(); }}
      >
        <Text style={styles.optEmoji}>{opt.emoji}</Text>
        <View style={styles.optTxt}>
          <Text style={[styles.optTitle, selected && { color: colors.red }]}>{opt.title}</Text>
          <Text style={styles.optFa}>{opt.titleFa}</Text>
          <Text style={styles.optDesc}>{opt.desc}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function ReceiptRow({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptKey}>{k}</Text>
      <Text style={[styles.receiptVal, highlight && { color: colors.red, fontWeight: '700' }]}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 40, gap: space.md },
  banner: { borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  bannerFa: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },
  questionCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, ...shadow.sm },
  questionLbl: { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 8 },
  question: { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 28, textAlign: 'right' },
  questionFa: { fontSize: 13, color: colors.textSub, marginTop: 6 },
  eligCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 10, ...shadow.sm },
  eligTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  eligRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eligIcon: { fontSize: 15, fontWeight: '700', width: 20 },
  eligOk: { color: colors.green },
  eligNo: { color: colors.textMuted },
  eligTxt: { fontSize: 14, color: colors.text, flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  optCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 2, borderColor: colors.border, ...shadow.sm },
  optCardOn: { borderColor: colors.red, backgroundColor: '#FFF5F5' },
  optEmoji: { fontSize: 30, marginTop: 2 },
  optTxt: { flex: 1 },
  optTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  optFa: { fontSize: 13, color: colors.textSub, marginTop: 2 },
  optDesc: { fontSize: 13, color: colors.textSub, marginTop: 6, lineHeight: 21 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  radioOn: { borderColor: colors.red },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.red },
  legal: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  // Loading
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  loadingSub: { fontSize: 15, color: colors.textSub, textAlign: 'center', marginTop: 10 },
  // Success
  successWrap: { padding: 20, alignItems: 'center', gap: 20 },
  successIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.greenLight, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.text },
  successSub: { fontSize: 15, color: colors.textSub, textAlign: 'center' },
  receiptCard: { width: '100%', backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  receiptHdr: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  receiptLabel: { fontSize: 11, fontWeight: '700', color: colors.navy, letterSpacing: 1 },
  receiptVerified: { fontSize: 11, fontWeight: '700', color: colors.green, letterSpacing: 0.5 },
  receiptDivider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  receiptKey: { fontSize: 13, color: colors.textSub },
  receiptVal: { fontSize: 13, color: colors.text, maxWidth: '60%', textAlign: 'right' },
  // Confirm sheet
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44, gap: 14 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center' },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sheetSub: { fontSize: 14, color: colors.textSub, textAlign: 'center', marginTop: -8 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.bg, borderRadius: radius.md, padding: 14 },
  sheetOptTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sheetOptFa: { fontSize: 13, color: colors.textSub },
  sheetWarn: { backgroundColor: colors.amberLight, borderRadius: radius.sm, padding: 12 },
  sheetWarnTxt: { fontSize: 13, color: colors.amber, lineHeight: 22 },
  sheetBtns: { flexDirection: 'row', gap: 10 },
});
