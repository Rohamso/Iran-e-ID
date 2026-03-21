import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import type { NationalIdCard } from '../types';
import { fmtDate, isExpired } from '../helpers';

const W = Dimensions.get('window').width - 48;
const H = W / 1.586; // Standard credit-card aspect ratio

export function IdCard({ card }: { card: NationalIdCard }) {
  const [flipped, setFlipped] = useState(false);
  const rot = useSharedValue(0);

  const flip = () => {
    rot.value = withSpring(flipped ? 0 : 180, { damping: 18, stiffness: 110 });
    setFlipped(!flipped);
  };

  const frontAnim = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rot.value, [0, 180], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute', width: '100%', height: '100%',
  }));
  const backAnim = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rot.value, [0, 180], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute', width: '100%', height: '100%',
  }));

  const expired = isExpired(card.expiryDate);

  return (
    <Pressable onPress={flip} style={{ width: W, height: H }}>
      {/* FRONT */}
      <Animated.View style={frontAnim}>
        <LinearGradient
          colors={['#0B2545', '#133870', '#1A4F8A']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[s.card, { width: W, height: H }]}
        >
          {/* Subtle pattern overlay */}
          <View style={s.patternTop} />
          <View style={s.patternBottom} />

          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <Image source={require('../../assets/lion-sun-square.png')} style={s.emblem} resizeMode="contain" />
            </View>
            <View style={s.headerCenter}>
              <Text style={s.countryFa}>جمهوری ایران</Text>
              <Text style={s.docTypeFa}>کارت هویت ملی</Text>
            </View>
            <View style={s.chip}>
              <View style={s.chipInner} />
            </View>
          </View>

          {/* Body */}
          <View style={s.body}>
            <View style={s.photoWrap}>
              {card.photoUri
                ? <Image source={{ uri: card.photoUri }} style={s.photo} />
                : <View style={s.photoPlaceholder}><Text style={s.photoPlaceholderTxt}>عکس</Text></View>
              }
            </View>
            <View style={s.fields}>
              <Text style={s.fullName} numberOfLines={1}>{card.fullName}</Text>
              <Text style={s.fullNameLatin} numberOfLines={1}>{card.fullNameLatin}</Text>
              <View style={s.fieldGrid}>
                <CardField label="کد ملی" value={card.idNumber} mono />
                <CardField label="تاریخ تولد" value={fmtDate(card.dateOfBirth)} />
                <CardField label="جنسیت" value={card.gender === 'M' ? 'مرد' : 'زن'} />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <View style={s.footerRow}>
              <SmallField label="صدور" value={fmtDate(card.issueDate)} />
              <SmallField label="انقضا" value={fmtDate(card.expiryDate)} alert={expired} />
            </View>
            <View style={[s.statusBadge, expired ? s.badgeExpired : s.badgeValid]}>
              <Text style={s.statusBadgeTxt}>{expired ? 'منقضی' : 'معتبر'}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* BACK */}
      <Animated.View style={backAnim}>
        <LinearGradient
          colors={['#091E38', '#0F2D52', '#163E6E']}
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
          style={[s.card, { width: W, height: H }]}
        >
          <View style={s.backStripe} />
          <View style={s.backContent}>
            <BackField label="نام پدر" value={card.fatherName} />
            <BackField label="محل تولد" value={card.placeOfBirth} />
            <BackField label="شماره سریال" value={card.serialNumber} mono />
          </View>
          {/* Barcode */}
          <View style={s.barcode}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View key={i} style={[s.bar, { height: [28, 18, 24, 32, 14, 22][i % 6], opacity: 0.6 + (i % 3) * 0.13 }]} />
            ))}
          </View>
          <Text style={s.flipHint}>برای برگشتن ضربه بزنید</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function CardField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={s.fieldItem}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={[s.fieldValue, mono && s.fieldMono]}>{value}</Text>
    </View>
  );
}

function SmallField({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <View>
      <Text style={s.smallLabel}>{label}</Text>
      <Text style={[s.smallValue, alert && { color: '#FF8A80' }]}>{value}</Text>
    </View>
  );
}

function BackField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={s.backFieldRow}>
      <Text style={s.backLabel}>{label}</Text>
      <Text style={[s.backValue, mono && { color: '#C9A84C', letterSpacing: 2 }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  patternTop: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  patternBottom: {
    position: 'absolute', bottom: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLeft: { width: 28, height: 28 },
  emblem: { width: 28, height: 28 },
  headerCenter: { flex: 1 },
  countryFa: { color: 'rgba(255,255,255,0.55)', fontSize: 9, letterSpacing: 0.5 },
  docTypeFa: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 1 },
  chip: {
    width: 36, height: 27, borderRadius: 5,
    backgroundColor: '#C9A84C',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4,
  },
  chipInner: { width: 26, height: 19, borderRadius: 3, borderWidth: 1, borderColor: 'rgba(160,130,42,0.8)' },
  body: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center', marginVertical: 6 },
  photoWrap: { },
  photo: { width: 52, height: 66, borderRadius: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  photoPlaceholder: {
    width: 52, height: 66, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  photoPlaceholderTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 8, fontWeight: '700' },
  fields: { flex: 1 },
  fullName: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  fullNameLatin: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2, marginBottom: 8 },
  fieldGrid: { gap: 5 },
  fieldItem: { },
  fieldLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: '600', letterSpacing: 0.4 },
  fieldValue: { color: '#fff', fontSize: 10, fontWeight: '600', marginTop: 1 },
  fieldMono: { color: '#C9A84C', letterSpacing: 1.8, fontWeight: '700', fontSize: 11 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  footerRow: { flexDirection: 'row', gap: 16 },
  smallLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8, letterSpacing: 0.3 },
  smallValue: { color: '#fff', fontSize: 10, fontWeight: '600', marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeValid: { backgroundColor: 'rgba(26,122,74,0.85)' },
  badgeExpired: { backgroundColor: 'rgba(176,32,32,0.85)' },
  statusBadgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  // Back
  backStripe: {
    position: 'absolute', top: 28, left: 0, right: 0,
    height: 36, backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backContent: { marginTop: 72, gap: 10 },
  backFieldRow: { },
  backLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '600', letterSpacing: 0.4 },
  backValue: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 2 },
  barcode: { flexDirection: 'row', gap: 2.5, alignItems: 'flex-end', marginTop: 'auto' },
  bar: { width: 2, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 1 },
  flipHint: { color: 'rgba(255,255,255,0.25)', fontSize: 9, textAlign: 'right', marginTop: 6 },
});
