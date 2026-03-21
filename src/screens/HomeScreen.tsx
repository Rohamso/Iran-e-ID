import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIdentityStore, useReferendumStore } from '../store';
import { colors, radius, shadow, space } from '../theme';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CARD_COLORS: Record<string, [string, string]> = {
  id:       [colors.navy,     '#1A4F8A'],
  passport: ['#133A1B',       '#206030'],
  license:  ['#0E4C6A',       '#0E8FAD'],
};

const CARD_META = [
  { key: 'id',       label: 'کارت ملی',  icon: '🪪' },
  { key: 'passport', label: 'گذرنامه',   icon: '📘' },
  { key: 'license',  label: 'گواهینامه', icon: '🚗' },
];

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { idCard, passport, drivingLicense } = useIdentityStore();
  const { status: voteStatus } = useReferendumStore();
  const voted = voteStatus === 'done';

  const docs = [
    idCard         && { key: 'id',       label: 'کارت ملی',  name: idCard.fullName || idCard.fullNameLatin },
    passport       && { key: 'passport', label: 'گذرنامه',   name: passport.surname + ' ' + passport.givenNames },
    drivingLicense && { key: 'license',  label: 'گواهینامه', name: drivingLicense.fullName },
  ].filter(Boolean) as { key: string; label: string; name: string }[];

  const docCount = docs.length;
  const initial = idCard?.fullName?.[0] ?? idCard?.fullNameLatin?.[0] ?? '?';
  const goIdentity = () => (nav as any).navigate('Main', { screen: 'Identity' });

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

        {/* Wallet widget */}
        <Pressable onPress={goIdentity} style={s.walletWidget}>
          <View style={s.walletHeader}>
            <Text style={s.walletTitle}>کارت‌های من</Text>
            <View style={s.walletBadge}>
              <Text style={s.walletBadgeTxt}>{docCount} کارت</Text>
            </View>
          </View>

          {docCount === 0 ? (
            /* No docs yet — show add prompt */
            <Pressable style={s.addCard} onPress={() => nav.navigate('AddId')}>
              <Text style={{ fontSize: 22 }}>🪪</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.addCardTitle}>افزودن کارت ملی</Text>
                <Text style={s.addCardSub}>برای شروع کارت ملی اضافه کنید</Text>
              </View>
              <Text style={s.addCardArrow}>+</Text>
            </Pressable>
          ) : (
            /* Stacked card strip previews */
            <View style={s.stackWrap}>
              {docs.map((doc, i) => (
                <LinearGradient
                  key={doc.key}
                  colors={CARD_COLORS[doc.key]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[s.cardStrip, i > 0 && { marginTop: -28 }, { zIndex: docs.length - i }]}
                >
                  <View style={s.cardStripInner}>
                    <View style={s.cardStripDot} />
                    <Text style={s.cardStripLabel}>{doc.label}</Text>
                    <Text style={s.cardStripName} numberOfLines={1}>{doc.name}</Text>
                  </View>
                  {/* Decorative circle */}
                  <View style={s.cardStripCircle} />
                </LinearGradient>
              ))}

              {/* Missing doc hints */}
              {docCount < 3 && (
                <View style={s.missingRow}>
                  {CARD_META.filter(m => !docs.find(d => d.key === m.key)).map(m => (
                    <Pressable
                      key={m.key}
                      style={s.missingPill}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        if (m.key === 'id') nav.navigate('AddId');
                        else if (m.key === 'passport') nav.navigate('AddPassport');
                        else nav.navigate('AddDrivingLicense');
                      }}
                    >
                      <Text style={s.missingPillTxt}>+ {m.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
        </Pressable>

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
            { icon: '🪪', label: 'کارت ملی',  bg: '#EBF2FA', action: goIdentity },
            { icon: '📘', label: 'گذرنامه',    bg: '#E8F5E9', action: goIdentity },
            { icon: '🚗', label: 'گواهینامه',  bg: '#E0F7FA', action: goIdentity },
            { icon: '🗳️', label: 'رای',         bg: '#FDECEA', action: () => (nav as any).navigate('Main', { screen: 'Vote' }) },
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

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 48, gap: space.md },

  hdr:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:  { fontSize: 13, color: colors.textMuted },
  name:      { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  avatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // Wallet widget
  walletWidget: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    overflow: 'hidden', ...shadow.card,
  },
  walletHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  walletTitle:    { fontSize: 14, fontWeight: '700', color: colors.text },
  walletBadge:    { backgroundColor: colors.navy, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  walletBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },

  stackWrap: { overflow: 'hidden' },
  cardStrip: {
    height: 62, borderRadius: 0,
    justifyContent: 'center', overflow: 'hidden',
  },
  cardStripInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 10,
  },
  cardStripDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  cardStripLabel:  { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', width: 70 },
  cardStripName:   { color: '#fff', fontSize: 13, fontWeight: '700', flex: 1 },
  cardStripCircle: {
    position: 'absolute', right: -30, top: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  missingRow: { flexDirection: 'row', gap: 8, padding: 12, flexWrap: 'wrap' },
  missingPill: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed',
    backgroundColor: colors.bg,
  },
  missingPillTxt: { fontSize: 12, fontWeight: '600', color: colors.textMuted },

  addCard:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  addCardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  addCardSub:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  addCardArrow: { fontSize: 22, color: colors.navy, fontWeight: '300' },

  // Referendum banner
  refBanner: { borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadow.md },
  refEmoji:  { fontSize: 30 },
  refText:   { flex: 1 },
  refTitle:  { color: '#fff', fontSize: 15, fontWeight: '700' },
  refSub:    { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3 },
  refArrow:  { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  refArrowTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Quick actions grid
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem:     { width: '46.5%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 8, ...shadow.sm },
  gridIcon:     { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridEmoji:    { fontSize: 26 },
  gridLabel:    { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },

  // Status card
  statusCard:    { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 16, ...shadow.sm },
  statusRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 },
  statusLabel:   { fontSize: 14, color: colors.text },
  pill:          { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillGreen:     { backgroundColor: colors.greenLight },
  pillGray:      { backgroundColor: colors.borderLight },
  pillTxt:       { fontSize: 12, fontWeight: '700' },
  pillGreenTxt:  { color: colors.green },
  pillGrayTxt:   { color: colors.textMuted },
  divider:       { height: 1, backgroundColor: colors.borderLight },
});
