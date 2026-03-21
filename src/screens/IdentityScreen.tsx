import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView,
  Dimensions, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIdentityStore } from '../store';
import { IdCard } from '../components/IdCard';
import { PassportCard } from '../components/PassportCard';
import { DrivingLicenseCard } from '../components/DrivingLicenseCard';
import { Button } from '../components/Button';
import { colors, radius, shadow, space } from '../theme';
import { fmtDate } from '../helpers';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const W = Dimensions.get('window').width;
const CARD_W = W - 48;
const CARD_H = Math.round(CARD_W / 1.586);
const PEEK = 76; // header strip height when collapsed

const SPRING = { damping: 22, stiffness: 200, useNativeDriver: false };

// Top position of card i when `active` card is expanded
const calcTop = (i: number, active: number) =>
  i <= active ? i * PEEK : CARD_H + (i - 1) * PEEK;

export default function IdentityScreen() {
  const nav = useNavigation<Nav>();
  const { idCard, passport, drivingLicense, clearIdCard, clearPassport, clearDrivingLicense } = useIdentityStore();
  const [activeIdx, setActiveIdx] = useState(0);

  const docs = [
    idCard         && { type: 'id',       card: <IdCard card={idCard} />,                      label: 'کارت ملی',  color: colors.navy },
    passport       && { type: 'passport', card: <PassportCard passport={passport} />,            label: 'گذرنامه',   color: colors.greenMid },
    drivingLicense && { type: 'license',  card: <DrivingLicenseCard license={drivingLicense} />, label: 'گواهینامه', color: colors.teal },
  ].filter(Boolean) as { type: string; card: React.ReactNode; label: string; color: string }[];

  // Re-init animated values when doc count changes
  const prevLen = useRef(-1);
  const anims = useRef<{ height: Animated.Value; top: Animated.Value }[]>([]);

  if (prevLen.current !== docs.length) {
    prevLen.current = docs.length;
    anims.current = docs.map((_, i) => ({
      height: new Animated.Value(i === 0 ? CARD_H : PEEK),
      top:    new Animated.Value(calcTop(i, 0)),
    }));
  }

  useEffect(() => { setActiveIdx(0); }, [docs.length]);

  const safeActive = Math.min(activeIdx, Math.max(0, docs.length - 1));

  const selectCard = (idx: number) => {
    if (idx === safeActive) return;
    Animated.parallel(
      docs.flatMap((_, i) => [
        Animated.spring(anims.current[i].height, { toValue: i === idx ? CARD_H : PEEK, ...SPRING }),
        Animated.spring(anims.current[i].top,    { toValue: calcTop(i, idx),          ...SPRING }),
      ])
    ).start();
    setActiveIdx(idx);
  };

  // ── Empty state ────────────────────────────────────────────────────
  if (docs.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.emptyContainer}>
          <Text style={s.pageTitle}>کیف مدارک</Text>
          <Text style={s.pageSubtitle}>مدارک هویتی خود را اضافه کنید</Text>
          <AddDocCard icon="🪪" title="کارت ملی"          subtitle="کارت هوشمند ملی ایران"   color={colors.navy}     onPress={() => nav.navigate('AddId')} />
          <AddDocCard icon="📘" title="گذرنامه"           subtitle="گذرنامه بین‌المللی"       color={colors.greenMid} onPress={() => nav.navigate('AddPassport')} />
          <AddDocCard icon="🚗" title="گواهینامه رانندگی" subtitle="گواهینامه رانندگی معتبر"  color={colors.teal}     onPress={() => nav.navigate('AddDrivingLicense')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const active = docs[safeActive];
  const containerH = CARD_H + (docs.length - 1) * PEEK;

  const detailRows: [string, string][] = (() => {
    if (active.type === 'id' && idCard) return [
      ['نام کامل',    idCard.fullName],
      ['نام لاتین',   idCard.fullNameLatin],
      ['کد ملی',      idCard.idNumber],
      ['نام پدر',     idCard.fatherName],
      ['محل تولد',    idCard.placeOfBirth],
      ['تاریخ تولد',  fmtDate(idCard.dateOfBirth)],
      ['جنسیت',       idCard.gender === 'M' ? 'مرد' : 'زن'],
      ['شماره سریال', idCard.serialNumber],
      ['تاریخ صدور',  fmtDate(idCard.issueDate)],
      ['تاریخ انقضا', fmtDate(idCard.expiryDate)],
    ];
    if (active.type === 'passport' && passport) return [
      ['نام خانوادگی',   passport.surname],
      ['نام',            passport.givenNames],
      ['شماره گذرنامه',  passport.passportNumber],
      ['ملیت',           passport.nationality],
      ['تاریخ تولد',     fmtDate(passport.dateOfBirth)],
      ['جنسیت',          passport.sex === 'M' ? 'مرد' : 'زن'],
      ['تاریخ انقضا',    fmtDate(passport.expiryDate)],
      ...(passport.personalNumber ? [['شماره شخصی', passport.personalNumber] as [string, string]] : []),
    ];
    if (active.type === 'license' && drivingLicense) return [
      ['نام کامل',        drivingLicense.fullName],
      ['نام لاتین',       drivingLicense.fullNameLatin],
      ['شماره گواهینامه', drivingLicense.licenseNumber],
      ['تاریخ تولد',      fmtDate(drivingLicense.dateOfBirth)],
      ['دسته‌بندی',        drivingLicense.categories],
      ['مرجع صادرکننده',  drivingLicense.issuingAuthority],
      ['تاریخ صدور',      fmtDate(drivingLicense.issueDate)],
      ['تاریخ انقضا',     fmtDate(drivingLicense.expiryDate)],
    ];
    return [];
  })();

  const onRemove = () => {
    if (active.type === 'id') clearIdCard();
    else if (active.type === 'passport') clearPassport();
    else clearDrivingLicense();
    // Force re-init on next render
    prevLen.current = -1;
    setActiveIdx(0);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={s.titleRow}>
          <Text style={s.pageTitle}>کیف مدارک</Text>
          <View style={s.addBtns}>
            {!idCard         && <Pressable style={s.addPill} onPress={() => nav.navigate('AddId')}><Text style={s.addPillTxt}>+ کارت ملی</Text></Pressable>}
            {!passport       && <Pressable style={s.addPill} onPress={() => nav.navigate('AddPassport')}><Text style={s.addPillTxt}>+ گذرنامه</Text></Pressable>}
            {!drivingLicense && <Pressable style={s.addPill} onPress={() => nav.navigate('AddDrivingLicense')}><Text style={s.addPillTxt}>+ گواهینامه</Text></Pressable>}
          </View>
        </View>

        {/* Apple Wallet stack */}
        <View style={[s.walletContainer, { height: containerH }]}>
          {docs.map((doc, i) => (
            <Animated.View
              key={doc.type}
              style={[
                s.walletCard,
                {
                  top:    anims.current[i].top,
                  height: anims.current[i].height,
                  zIndex: i === safeActive ? 100 : docs.length - i,
                  shadowOpacity: i === safeActive ? 0.3 : 0.12,
                  elevation:     i === safeActive ? 20  : 6,
                },
              ]}
            >
              <Pressable onPress={() => selectCard(i)} style={{ flex: 1 }}>
                {doc.card}
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {docs.length > 1 && (
          <Text style={s.hint}>روی کارت دیگر ضربه بزنید تا باز شود</Text>
        )}

        {/* Detail panel */}
        <View style={s.detailPanel}>
          <View style={s.detailHeader}>
            <View style={[s.detailDot, { backgroundColor: active.color }]} />
            <Text style={s.detailTitle}>{active.label}</Text>
          </View>

          {detailRows.map(([k, v], i) => (
            <View key={k} style={[s.detailRow, i === detailRows.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={s.detailKey}>{k}</Text>
              <Text style={s.detailVal}>{v}</Text>
            </View>
          ))}

          <View style={s.detailFooter}>
            <Button label={`حذف ${active.label}`} variant="danger" onPress={onRemove} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function AddDocCard({ icon, title, subtitle, color, onPress }: {
  icon: string; title: string; subtitle: string; color: string; onPress: () => void;
}) {
  return (
    <Pressable style={s.addDocCard} onPress={onPress}>
      <View style={[s.addDocIcon, { backgroundColor: color + '18' }]}>
        <Text style={{ fontSize: 28 }}>{icon}</Text>
      </View>
      <View style={s.addDocText}>
        <Text style={s.addDocTitle}>{title}</Text>
        <Text style={s.addDocSub}>{subtitle}</Text>
      </View>
      <View style={[s.addDocArrow, { backgroundColor: color + '15' }]}>
        <Text style={[s.addDocArrowTxt, { color }]}>+</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.bg },
  emptyContainer: { padding: space.md, paddingBottom: 48, gap: 12, paddingTop: 20 },
  container:      { paddingBottom: 48 },

  titleRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, paddingTop: 20, paddingBottom: 20 },
  pageTitle:  { fontSize: 26, fontWeight: '800', color: colors.text },
  pageSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 8 },
  addBtns:    { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '55%' },
  addPill:    { backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.border, ...shadow.xs },
  addPillTxt: { color: colors.navy, fontSize: 11, fontWeight: '700' },

  // Wallet
  walletContainer: { marginHorizontal: 24, position: 'relative' },
  walletCard: {
    position: 'absolute',
    left: 0, right: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },

  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 16, marginBottom: 4 },

  // Detail panel
  detailPanel: {
    marginHorizontal: space.md, marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  detailDot:   { width: 10, height: 10, borderRadius: 5 },
  detailTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  detailKey: { fontSize: 13, color: colors.textSub },
  detailVal: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'right', maxWidth: '55%' },
  detailFooter: { padding: 16 },

  // Empty / Add cards
  addDocCard:     { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadow.sm },
  addDocIcon:     { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  addDocText:     { flex: 1 },
  addDocTitle:    { fontSize: 15, fontWeight: '700', color: colors.text },
  addDocSub:      { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  addDocArrow:    { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  addDocArrowTxt: { fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
