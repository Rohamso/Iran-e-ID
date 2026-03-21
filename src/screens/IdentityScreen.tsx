import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent,
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

export default function IdentityScreen() {
  const nav = useNavigation<Nav>();
  const { idCard, passport, drivingLicense, clearIdCard, clearPassport, clearDrivingLicense } = useIdentityStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const docs = [
    idCard        && { type: 'id',       card: <IdCard card={idCard} />,                     label: 'کارت ملی',         color: colors.navy },
    passport      && { type: 'passport', card: <PassportCard passport={passport} />,           label: 'گذرنامه',          color: colors.greenMid },
    drivingLicense && { type: 'license', card: <DrivingLicenseCard license={drivingLicense} />, label: 'گواهینامه',        color: colors.teal },
  ].filter(Boolean) as { type: string; card: React.ReactNode; label: string; color: string }[];

  const hasAny = docs.length > 0;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveIdx(idx);
  };

  // ── Empty state ──────────────────────────────────────────────────
  if (!hasAny) {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.emptyContainer}>
          <Text style={s.pageTitle}>کیف مدارک</Text>
          <Text style={s.pageSubtitle}>مدارک هویتی خود را اضافه کنید</Text>

          <AddDocCard
            icon="🪪" title="کارت ملی" subtitle="کارت هوشمند ملی ایران"
            color={colors.navy} onPress={() => nav.navigate('AddId')}
          />
          <AddDocCard
            icon="📘" title="گذرنامه" subtitle="گذرنامه بین‌المللی"
            color={colors.greenMid} onPress={() => nav.navigate('AddPassport')}
          />
          <AddDocCard
            icon="🚗" title="گواهینامه رانندگی" subtitle="گواهینامه رانندگی معتبر"
            color={colors.teal} onPress={() => nav.navigate('AddDrivingLicense')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Active doc details ───────────────────────────────────────────
  const active = docs[activeIdx] ?? docs[0];

  const detailRows: [string, string][] = (() => {
    if (active.type === 'id' && idCard) return [
      ['نام کامل', idCard.fullName],
      ['نام لاتین', idCard.fullNameLatin],
      ['کد ملی', idCard.idNumber],
      ['نام پدر', idCard.fatherName],
      ['محل تولد', idCard.placeOfBirth],
      ['تاریخ تولد', fmtDate(idCard.dateOfBirth)],
      ['جنسیت', idCard.gender === 'M' ? 'مرد' : 'زن'],
      ['شماره سریال', idCard.serialNumber],
      ['تاریخ صدور', fmtDate(idCard.issueDate)],
      ['تاریخ انقضا', fmtDate(idCard.expiryDate)],
    ];
    if (active.type === 'passport' && passport) return [
      ['نام خانوادگی', passport.surname],
      ['نام', passport.givenNames],
      ['شماره گذرنامه', passport.passportNumber],
      ['ملیت', passport.nationality],
      ['تاریخ تولد', fmtDate(passport.dateOfBirth)],
      ['جنسیت', passport.sex === 'M' ? 'مرد' : 'زن'],
      ['تاریخ انقضا', fmtDate(passport.expiryDate)],
      ...(passport.personalNumber ? [['شماره شخصی', passport.personalNumber] as [string, string]] : []),
    ];
    if (active.type === 'license' && drivingLicense) return [
      ['نام کامل', drivingLicense.fullName],
      ['نام لاتین', drivingLicense.fullNameLatin],
      ['شماره گواهینامه', drivingLicense.licenseNumber],
      ['تاریخ تولد', fmtDate(drivingLicense.dateOfBirth)],
      ['دسته‌بندی', drivingLicense.categories],
      ['مرجع صادرکننده', drivingLicense.issuingAuthority],
      ['تاریخ صدور', fmtDate(drivingLicense.issueDate)],
      ['تاریخ انقضا', fmtDate(drivingLicense.expiryDate)],
    ];
    return [];
  })();

  const onRemove = () => {
    if (active.type === 'id') clearIdCard();
    else if (active.type === 'passport') clearPassport();
    else clearDrivingLicense();
    setActiveIdx(0);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={s.titleRow}>
          <Text style={s.pageTitle}>کیف مدارک</Text>
          <View style={s.addBtns}>
            {!idCard && (
              <Pressable style={s.addPill} onPress={() => nav.navigate('AddId')}>
                <Text style={s.addPillTxt}>+ کارت ملی</Text>
              </Pressable>
            )}
            {!passport && (
              <Pressable style={s.addPill} onPress={() => nav.navigate('AddPassport')}>
                <Text style={s.addPillTxt}>+ گذرنامه</Text>
              </Pressable>
            )}
            {!drivingLicense && (
              <Pressable style={s.addPill} onPress={() => nav.navigate('AddDrivingLicense')}>
                <Text style={s.addPillTxt}>+ گواهینامه</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Card carousel */}
        <View style={s.carouselWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            contentContainerStyle={s.carousel}
            decelerationRate="fast"
            snapToInterval={W}
            snapToAlignment="center"
          >
            {docs.map((doc, i) => (
              <View key={doc.type} style={[s.cardPage, { width: W }]}>
                {doc.card}
              </View>
            ))}
          </ScrollView>

          {/* Dots */}
          {docs.length > 1 && (
            <View style={s.dots}>
              {docs.map((_, i) => (
                <View key={i} style={[s.dot, i === activeIdx && s.dotActive, { backgroundColor: active.color }]} />
              ))}
            </View>
          )}
        </View>

        {/* Flip hint */}
        {active.type === 'id' && (
          <Text style={s.hint}>برای دیدن پشت کارت ضربه بزنید</Text>
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

function AddDocCard({ icon, title, subtitle, color, onPress }: { icon: string; title: string; subtitle: string; color: string; onPress: () => void }) {
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
  safe: { flex: 1, backgroundColor: colors.bg },
  emptyContainer: { padding: space.md, paddingBottom: 48, gap: 12, paddingTop: 20 },
  container: { paddingBottom: 48 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, paddingTop: 20, paddingBottom: 16 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: colors.text },
  pageSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 8 },
  addBtns: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '55%' },
  addPill: { backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.border, ...shadow.xs },
  addPillTxt: { color: colors.navy, fontSize: 11, fontWeight: '700' },

  carouselWrap: { },
  carousel: { },
  cardPage: { paddingHorizontal: 24, paddingVertical: 4 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border, opacity: 0.35 },
  dotActive: { width: 20, borderRadius: 3, opacity: 1 },

  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginBottom: 12 },

  detailPanel: {
    marginHorizontal: space.md, marginTop: 8,
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
  detailDot: { width: 10, height: 10, borderRadius: 5 },
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
  addDocCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    ...shadow.sm,
  },
  addDocIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  addDocText: { flex: 1 },
  addDocTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  addDocSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  addDocArrow: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  addDocArrowTxt: { fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
