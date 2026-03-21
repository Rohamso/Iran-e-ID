import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Image } from 'react-native';
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
  const { idCard, passport, drivingLicense } = useIdentityStore();
  const { status: voteStatus } = useReferendumStore();
  const voted = voteStatus === 'done';

  const docCount = [idCard, passport, drivingLicense].filter(Boolean).length;
  const initial = idCard?.fullName?.[0] ?? idCard?.fullNameLatin?.[0] ?? '?';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.hdr}>
          <View>
            <Text style={s.greeting}>خوش آمدید 👋</Text>
            <Text style={s.name}>{idCard?.fullName || idCard?.fullNameLatin || 'Iran e-ID'}</Text>
          </View>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{initial.toUpperCase()}</Text>
          </View>
        </View>

        {/* Document summary card */}
        {idCard ? (
          <Pressable onPress={() => (nav as any).navigate('Main', { screen: 'Identity' })}>
            <LinearGradient
              colors={[colors.navy, colors.navyMid]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.idSummary}
            >
              <View style={s.idSummaryTop}>
                <View style={s.idSummaryLeft}>
                  <Text style={s.idSummaryLabel}>کارت هویت ملی</Text>
                  <Text style={s.idSummaryName}>{idCard.fullName}</Text>
                  <Text style={s.idSummaryNameLatin}>{idCard.fullNameLatin}</Text>
                  <Text style={s.idSummaryNum}>{maskId(idCard.idNumber)}</Text>
                </View>
                <View style={s.idSummaryRight}>
                  <Image source={require('../../assets/lion-sun-square.png')} style={s.idEmblem} resizeMode="contain" />
                  <View style={s.idChip}><View style={s.idChipInner} /></View>
                </View>
              </View>
              <View style={s.idSummaryBottom}>
                <Text style={s.idExpiry}>انقضا {fmtDate(idCard.expiryDate)}</Text>
                <View style={s.verifiedBadge}><Text style={s.verifiedTxt}>✓ تایید شده</Text></View>
              </View>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable style={s.addCard} onPress={() => nav.navigate('AddId')}>
            <View style={s.addCardIcon}><Text style={{ fontSize: 26 }}>🪪</Text></View>
            <View style={s.addCardText}>
              <Text style={s.addCardTitle}>افزودن کارت ملی</Text>
              <Text style={s.addCardSub}>برای رای دادن در رفراندم لازم است</Text>
            </View>
            <Text style={s.addCardArrow}>+</Text>
          </Pressable>
        )}

        {/* Docs at a glance */}
        <View style={s.docsRow}>
          <DocPill
            label="گذرنامه" active={!!passport} color={colors.greenMid}
            onPress={() => (nav as any).navigate('Main', { screen: 'Identity' })}
          />
          <DocPill
            label="گواهینامه" active={!!drivingLicense} color={colors.teal}
            onPress={() => (nav as any).navigate('Main', { screen: 'Identity' })}
          />
          <View style={[s.docPillCount, { backgroundColor: docCount > 0 ? colors.navy : colors.border }]}>
            <Text style={[s.docPillCountTxt, { color: docCount > 0 ? '#fff' : colors.textMuted }]}>{docCount} مدرک</Text>
          </View>
        </View>

        {/* Referendum banner */}
        <Pressable onPress={() => (nav as any).navigate('Main', { screen: 'Vote' })}>
          <LinearGradient
            colors={voted ? [colors.greenMid, colors.green] : [colors.red, '#8B1E1E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.refBanner}
          >
            <Text style={s.refEmoji}>{voted ? '✅' : '🗳️'}</Text>
            <View style={s.refText}>
              <Text style={s.refTitle}>{voted ? 'رای ثبت شد' : 'رفراندم ایران'}</Text>
              <Text style={s.refSub}>
                {voted
                  ? 'صدای شما شنیده شد'
                  : idCard ? 'واجد شرایط رای دادن هستید'
                  : 'برای رای دادن کارت ملی اضافه کنید'}
              </Text>
            </View>
            <View style={s.refArrow}>
              <Text style={s.refArrowTxt}>{voted ? '✓' : '←'}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Quick actions */}
        <Text style={s.sectionTitle}>دسترسی سریع</Text>
        <View style={s.grid}>
          {[
            { icon: '🪪', label: 'کارت ملی',   bg: '#EBF2FA', action: () => (nav as any).navigate('Main', { screen: 'Identity' }) },
            { icon: '📘', label: 'گذرنامه',     bg: '#E8F5E9', action: () => (nav as any).navigate('Main', { screen: 'Identity' }) },
            { icon: '🚗', label: 'گواهینامه',   bg: '#E0F7FA', action: () => (nav as any).navigate('Main', { screen: 'Identity' }) },
            { icon: '🗳️', label: 'رای',          bg: '#FDECEA', action: () => (nav as any).navigate('Main', { screen: 'Vote' }) },
          ].map(({ icon, label, bg, action }) => (
            <Pressable key={label} style={s.gridItem} onPress={action}>
              <View style={[s.gridIcon, { backgroundColor: bg }]}>
                <Text style={s.gridEmoji}>{icon}</Text>
              </View>
              <Text style={s.gridLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Status */}
        <Text style={s.sectionTitle}>وضعیت</Text>
        <View style={s.statusCard}>
          {[
            { label: 'کارت ملی',    ok: !!idCard },
            { label: 'گذرنامه',     ok: !!passport },
            { label: 'گواهینامه',   ok: !!drivingLicense },
            { label: 'رای رفراندم', ok: voted },
          ].map(({ label, ok }, i, arr) => (
            <React.Fragment key={label}>
              <View style={s.statusRow}>
                <Text style={s.statusLabel}>{label}</Text>
                <View style={[s.pill, ok ? s.pillGreen : s.pillGray]}>
                  <Text style={[s.pillTxt, ok ? s.pillGreenTxt : s.pillGrayTxt]}>
                    {ok ? '✓ انجام شد' : '○ در انتظار'}
                  </Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function DocPill({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.docPill, active ? { backgroundColor: color + '18', borderColor: color + '40' } : {}]}>
      <View style={[s.docPillDot, { backgroundColor: active ? color : colors.border }]} />
      <Text style={[s.docPillLabel, { color: active ? color : colors.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 48, gap: space.md },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: colors.textMuted },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },

  idSummary: { borderRadius: radius.lg, padding: 20, gap: 14, ...shadow.card },
  idSummaryTop: { flexDirection: 'row', justifyContent: 'space-between' },
  idSummaryLeft: { flex: 1 },
  idSummaryRight: { alignItems: 'flex-end', gap: 8 },
  idSummaryLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  idSummaryName: { color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 4 },
  idSummaryNameLatin: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  idSummaryNum: { color: colors.gold, fontSize: 15, fontWeight: '700', letterSpacing: 2.5, marginTop: 10 },
  idEmblem: { width: 32, height: 32 },
  idChip: { width: 34, height: 26, borderRadius: 5, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center' },
  idChipInner: { width: 24, height: 18, borderRadius: 3, borderWidth: 1, borderColor: colors.goldDark },
  idSummaryBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idExpiry: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  verifiedBadge: { backgroundColor: 'rgba(26,122,74,0.9)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  verifiedTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },

  addCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', ...shadow.xs },
  addCardIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EBF2FA', justifyContent: 'center', alignItems: 'center' },
  addCardText: { flex: 1 },
  addCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  addCardSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  addCardArrow: { fontSize: 22, color: colors.navy, fontWeight: '300', marginStart: 'auto' },

  docsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  docPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadow.xs },
  docPillDot: { width: 7, height: 7, borderRadius: 4 },
  docPillLabel: { fontSize: 12, fontWeight: '600' },
  docPillCount: { marginStart: 'auto', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  docPillCountTxt: { fontSize: 12, fontWeight: '700' },

  refBanner: { borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadow.md },
  refEmoji: { fontSize: 30 },
  refText: { flex: 1 },
  refTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  refSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3 },
  refArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  refArrowTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '46.5%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 8, ...shadow.sm },
  gridIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridEmoji: { fontSize: 26 },
  gridLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },

  statusCard: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 16, ...shadow.sm },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 },
  statusLabel: { fontSize: 14, color: colors.text },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillGreen: { backgroundColor: colors.greenLight },
  pillGray: { backgroundColor: colors.borderLight },
  pillTxt: { fontSize: 12, fontWeight: '700' },
  pillGreenTxt: { color: colors.green },
  pillGrayTxt: { color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.borderLight },
});
