import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import type { NationalIdCard } from '../types';
import { fmtDate, isExpired } from '../helpers';

const W = Dimensions.get('window').width - 40;
const H = W * 0.62;

export function IdCard({ card }: { card: NationalIdCard }) {
  const [flipped, setFlipped] = useState(false);
  const rot = useSharedValue(0);

  const flip = () => {
    rot.value = withSpring(flipped ? 0 : 180, { damping: 18, stiffness: 120 });
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
        <LinearGradient colors={['#0B2545', '#1A4F8A', '#2171B5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, { width: W, height: H }]}>
          {/* Top row */}
          <View style={s.top}>
            <View>
              <Text style={s.country}>IRAN / ایران</Text>
              <Text style={s.docType}>کارت هویت ملی</Text>
            </View>
            {/* Chip */}
            <View style={s.chip}><View style={s.chipLines} /></View>
          </View>
          {/* Middle */}
          <View style={s.mid}>
            {/* Photo */}
            <View style={s.photoBox}>
              {card.photoUri
                ? <Image source={{ uri: card.photoUri }} style={s.photo} />
                : <View style={s.photoEmpty}><Text style={s.photoEmptyTxt}>عکس</Text></View>
              }
            </View>
            {/* Fields */}
            <View style={s.fields}>
              <Text style={s.name} numberOfLines={1}>{card.fullName}</Text>
              <Text style={s.nameLatin} numberOfLines={1}>{card.fullNameLatin}</Text>
              <Field label="کد ملی" value={card.idNumber} mono />
              <Field label="تاریخ تولد" value={fmtDate(card.dateOfBirth)} />
              <Field label="جنسیت" value={card.gender === 'M' ? 'مرد' : 'زن'} />
            </View>
          </View>
          {/* Footer */}
          <View style={s.footer}>
            <SmallField label="صدور" value={fmtDate(card.issueDate)} />
            <SmallField label="انقضا" value={fmtDate(card.expiryDate)} error={expired} />
            <View style={[s.badge, expired ? s.badgeRed : s.badgeGreen]}>
              <Text style={s.badgeTxt}>{expired ? 'منقضی' : 'معتبر'}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* BACK */}
      <Animated.View style={backAnim}>
        <LinearGradient colors={['#071B35', '#0F2D52', '#1A4070']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[s.card, { width: W, height: H }]}>
          <Text style={s.backTitle}>جزئیات کارت</Text>
          <View style={s.backField}><Text style={s.backLbl}>نام پدر</Text><Text style={s.backVal}>{card.fatherName}</Text></View>
          <View style={s.backField}><Text style={s.backLbl}>محل تولد</Text><Text style={s.backVal}>{card.placeOfBirth}</Text></View>
          <View style={s.backField}><Text style={s.backLbl}>شماره سریال</Text><Text style={s.serial}>{card.serialNumber}</Text></View>
          {/* Barcode decoration */}
          <View style={s.barcode}>
            {Array.from({ length: 32 }).map((_, i) => (
              <View key={i} style={[s.bar, { height: [24, 18, 22, 28, 16][i % 5] }]} />
            ))}
          </View>
          <Text style={s.flipHint}>برای چرخش ضربه بزنید</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={s.fieldRow}>
      <Text style={s.fieldLbl}>{label}</Text>
      <Text style={[s.fieldVal, mono && s.fieldMono]}>{value}</Text>
    </View>
  );
}

function SmallField({ label, value, error }: { label: string; value: string; error?: boolean }) {
  return (
    <View>
      <Text style={s.footerLbl}>{label}</Text>
      <Text style={[s.footerVal, error && { color: '#FF8A80' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 12 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  country: { color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1.2 },
  docType: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  chip: { width: 34, height: 26, borderRadius: 4, backgroundColor: '#C9A84C', justifyContent: 'center', alignItems: 'center' },
  chipLines: { width: 24, height: 18, borderRadius: 2, borderWidth: 1, borderColor: '#A0822A' },
  mid: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center' },
  photoBox: {},
  photo: { width: 56, height: 70, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  photoEmpty: { width: 56, height: 70, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  photoEmptyTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700' },
  fields: { flex: 1 },
  name: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  nameLatin: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginBottom: 5 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  fieldLbl: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '600', letterSpacing: 0.3 },
  fieldVal: { color: '#fff', fontSize: 9, fontWeight: '600' },
  fieldMono: { letterSpacing: 1.5, color: '#C9A84C', fontWeight: '700', fontSize: 10 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  footerLbl: { color: 'rgba(255,255,255,0.5)', fontSize: 8 },
  footerVal: { color: '#fff', fontSize: 9, fontWeight: '600', marginTop: 1 },
  badge: { marginStart: 'auto', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeGreen: { backgroundColor: 'rgba(26,122,74,0.9)' },
  badgeRed: { backgroundColor: 'rgba(176,32,32,0.9)' },
  badgeTxt: { color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  // Back
  backTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  backField: { gap: 2 },
  backLbl: { color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: '600', letterSpacing: 0.3 },
  backVal: { color: '#fff', fontSize: 12, fontWeight: '600' },
  serial: { color: '#C9A84C', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  barcode: { flexDirection: 'row', gap: 2, alignItems: 'flex-end' },
  bar: { width: 2, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 1 },
  flipHint: { color: 'rgba(255,255,255,0.3)', fontSize: 9, textAlign: 'right' },
});
