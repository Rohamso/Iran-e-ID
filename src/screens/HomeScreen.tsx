import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIdentityStore, useReferendumStore } from '../store';
import { colors, radius, shadow, space } from '../theme';
import { maskId, fmtDate } from '../helpers';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { idCard, passport } = useIdentityStore();
  const { status: voteStatus } = useReferendumStore();
  const voted = voteStatus === 'done';

  const initial = idCard?.fullNameLatin?.[0] ?? idCard?.fullName?.[0] ?? '?';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hdr}>
          <View>
            <Text style={styles.greeting}>خوش آمدید 👋</Text>
            <Text style={styles.name}>{idCard?.fullName || idCard?.fullNameLatin || 'Iran e-ID'}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{initial.toUpperCase()}</Text>
          </View>
        </View>

        {/* ID Card summary OR add prompt */}
        {idCard ? (
          <LinearGradient colors={['#0B2545', '#1A4F8A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.idSummary}>
            <View style={styles.idTop}>
              <View>
                <Text style={styles.idLbl}>کارت هویت ملی</Text>
                <Text style={styles.idName}>{idCard.fullName}</Text>
                <Text style={styles.idNameLatin}>{idCard.fullNameLatin}</Text>
                <Text style={styles.idNum}>{maskId(idCard.idNumber)}</Text>
              </View>
              <View style={styles.chip}><View style={styles.chipLine} /></View>
            </View>
            <View style={styles.idBottom}>
              <Text style={styles.idExpiry}>انقضا {fmtDate(idCard.expiryDate)}</Text>
              <View style={styles.verifiedBadge}><Text style={styles.verifiedTxt}>✓ تایید شده</Text></View>
            </View>
          </LinearGradient>
        ) : (
          <Pressable style={styles.addCard} onPress={() => nav.navigate('AddId')}>
            <Text style={styles.addIcon}>➕</Text>
            <View>
              <Text style={styles.addTitle}>مدرک هویتی خود را اضافه کنید</Text>
              <Text style={styles.addSub}>برای رای دادن در رفراندم لازم است</Text>
            </View>
            <Text style={styles.addArrow}>←</Text>
          </Pressable>
        )}

        {/* Referendum banner */}
        <Pressable onPress={() => (nav as any).navigate('Main', { screen: 'Vote' })}>
          <LinearGradient
            colors={voted ? ['#0D3D20', '#1A7A4A'] : ['#5A1010', '#9B2020']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.refBanner}
          >
            <Text style={styles.refEmoji}>{voted ? '✅' : '🗳️'}</Text>
            <View style={styles.refText}>
              <Text style={styles.refTitle}>{voted ? 'رای ثبت شد' : 'رفراندم ایران'}</Text>
              <Text style={styles.refSub}>
                {voted ? 'صدای شما شنیده شد' : idCard ? 'شما واجد شرایط رای دادن هستید' : 'برای واجد شرایط شدن مدرک هویتی اضافه کنید'}
              </Text>
            </View>
            <Text style={styles.refArrow}>{voted ? '✓' : '←'}</Text>
          </LinearGradient>
        </Pressable>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>دسترسی سریع</Text>
        <View style={styles.grid}>
          {[
            { icon: '🪪', label: 'کارت ملی',   action: () => (nav as any).navigate('Main', { screen: 'Identity' }) },
            { icon: '📘', label: 'گذرنامه',     action: () => (nav as any).navigate('Main', { screen: 'Identity' }) },
            { icon: '🗳️', label: 'رای',          action: () => (nav as any).navigate('Main', { screen: 'Vote' }) },
            { icon: '⚙️', label: 'تنظیمات',     action: () => (nav as any).navigate('Main', { screen: 'Settings' }) },
          ].map(({ icon, label, action }) => (
            <Pressable key={label} style={styles.gridItem} onPress={action}>
              <View style={styles.gridIcon}><Text style={styles.gridEmoji}>{icon}</Text></View>
              <Text style={styles.gridLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.sectionTitle}>وضعیت</Text>
        <View style={styles.statusCard}>
          {[
            { label: 'کارت ملی',       ok: !!idCard },
            { label: 'گذرنامه',        ok: !!passport },
            { label: 'رای رفراندم',    ok: voted },
          ].map(({ label, ok }, i, arr) => (
            <React.Fragment key={label}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{label}</Text>
                <View style={[styles.pill, ok ? styles.pillGreen : styles.pillGray]}>
                  <Text style={[styles.pillTxt, ok ? styles.pillTxtGreen : styles.pillTxtGray]}>
                    {ok ? '✓ انجام شد' : '○ در انتظار'}
                  </Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 40, gap: space.md },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: colors.textMuted },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  idSummary: { borderRadius: radius.lg, padding: 18, gap: 10 },
  idTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idLbl: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  idName: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 4 },
  idNameLatin: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 1 },
  idNum: { color: colors.gold, fontSize: 15, fontWeight: '700', letterSpacing: 2, marginTop: 8 },
  chip: { width: 32, height: 24, borderRadius: 4, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center' },
  chipLine: { width: 22, height: 16, borderRadius: 2, borderWidth: 1, borderColor: colors.goldDark },
  idBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idExpiry: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
  verifiedBadge: { backgroundColor: 'rgba(26,122,74,0.9)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  verifiedTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  addIcon: { fontSize: 28 },
  addTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  addSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  addArrow: { marginStart: 'auto', fontSize: 18, color: colors.navy, fontWeight: '700' },
  refBanner: { borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  refEmoji: { fontSize: 32 },
  refText: { flex: 1 },
  refTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  refSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  refArrow: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '46.5%', backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 8, ...shadow.sm },
  gridIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#EBF2FA', justifyContent: 'center', alignItems: 'center' },
  gridEmoji: { fontSize: 26 },
  gridLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },
  statusCard: { backgroundColor: colors.white, borderRadius: radius.lg, paddingHorizontal: 16, ...shadow.sm },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  statusLabel: { fontSize: 14, color: colors.text },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillGreen: { backgroundColor: colors.greenLight },
  pillGray: { backgroundColor: '#F0F2F5' },
  pillTxt: { fontSize: 12, fontWeight: '700' },
  pillTxtGreen: { color: colors.green },
  pillTxtGray: { color: colors.textMuted },
  divider: { height: 1, backgroundColor: '#F0F2F5' },
});
