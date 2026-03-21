import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { DrivingLicense } from '../types';
import { fmtDate, isExpired } from '../helpers';

const W = Dimensions.get('window').width - 48;
const H = W / 1.586;

export function DrivingLicenseCard({ license: l }: { license: DrivingLicense }) {
  const expired = isExpired(l.expiryDate);
  const cats = l.categories.split(',').map(c => c.trim()).filter(Boolean);

  return (
    <LinearGradient
      colors={['#0E4C6A', '#0D6E8C', '#0E8FAD']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[s.card, { width: W, height: H }]}
    >
      {/* Decorative circles */}
      <View style={s.circle1} />
      <View style={s.circle2} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image source={require('../../assets/lion-sun-square.png')} style={s.emblem} resizeMode="contain" />
        </View>
        <View style={s.headerCenter}>
          <Text style={s.countryFa}>گواهینامه رانندگی</Text>
          <Text style={s.countryLatin}>DRIVING LICENCE · IRAN</Text>
        </View>
        <View style={s.euFlag}>
          <Text style={s.euFlagTxt}>IR</Text>
        </View>
      </View>

      {/* Body */}
      <View style={s.body}>
        <View style={s.photoWrap}>
          {l.photoUri
            ? <Image source={{ uri: l.photoUri }} style={s.photo} />
            : <View style={s.photoPlaceholder}><Text style={s.photoPlaceholderTxt}>عکس</Text></View>
          }
          {/* Category badges */}
          <View style={s.catWrap}>
            {cats.slice(0, 4).map(c => (
              <View key={c} style={s.catBadge}>
                <Text style={s.catTxt}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.fields}>
          <Text style={s.fullName} numberOfLines={1}>{l.fullName}</Text>
          <Text style={s.fullNameLatin} numberOfLines={1}>{l.fullNameLatin}</Text>
          <View style={s.fieldGrid}>
            <DField label="شماره گواهینامه" value={l.licenseNumber} mono />
            <DField label="تاریخ تولد" value={fmtDate(l.dateOfBirth)} />
            <DField label="مرجع صادرکننده" value={l.issuingAuthority} />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.footerRow}>
          <SmallField label="صدور" value={fmtDate(l.issueDate)} />
          <SmallField label="انقضا" value={fmtDate(l.expiryDate)} alert={expired} />
        </View>
        <View style={[s.badge, expired ? s.badgeRed : s.badgeValid]}>
          <Text style={s.badgeTxt}>{expired ? 'منقضی' : 'معتبر'}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function DField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
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

const s = StyleSheet.create({
  card: {
    borderRadius: 16, padding: 16, justifyContent: 'space-between', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },
  circle1: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.05)' },
  circle2: { position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.04)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerLeft: { width: 26, height: 26 },
  emblem: { width: 26, height: 26 },
  headerCenter: { flex: 1 },
  countryFa: { color: '#fff', fontSize: 11, fontWeight: '700' },
  countryLatin: { color: 'rgba(255,255,255,0.5)', fontSize: 8, marginTop: 1 },
  euFlag: { width: 28, height: 28, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  euFlagTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  body: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center', marginVertical: 6 },
  photoWrap: { gap: 5 },
  photo: { width: 50, height: 62, borderRadius: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  photoPlaceholder: { width: 50, height: 62, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  photoPlaceholderTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 7, fontWeight: '700' },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  catBadge: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  catTxt: { color: '#fff', fontSize: 8, fontWeight: '700' },
  fields: { flex: 1 },
  fullName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  fullNameLatin: { color: 'rgba(255,255,255,0.55)', fontSize: 9, marginTop: 2, marginBottom: 7 },
  fieldGrid: { gap: 5 },
  fieldItem: {},
  fieldLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: '600', letterSpacing: 0.3 },
  fieldValue: { color: '#fff', fontSize: 10, fontWeight: '600', marginTop: 1 },
  fieldMono: { color: '#7DD3FC', letterSpacing: 1.5, fontWeight: '700', fontSize: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  footerRow: { flexDirection: 'row', gap: 16 },
  smallLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8 },
  smallValue: { color: '#fff', fontSize: 10, fontWeight: '600', marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeValid: { backgroundColor: 'rgba(26,122,74,0.85)' },
  badgeRed: { backgroundColor: 'rgba(176,32,32,0.85)' },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
});
