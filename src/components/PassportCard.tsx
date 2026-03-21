import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Passport } from '../types';
import { fmtDate, isExpired } from '../helpers';

const W = Dimensions.get('window').width - 48;
const H = W / 1.586;

export function PassportCard({ passport: p }: { passport: Passport }) {
  const expired = isExpired(p.expiryDate);
  return (
    <LinearGradient
      colors={['#133A1B', '#1A5228', '#206030']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[s.card, { width: W, height: H }]}
    >
      {/* Corner accents */}
      <View style={s.cornerTR} />
      <View style={s.cornerBL} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.countryFa}>جمهوری اسلامی ایران</Text>
          <Text style={s.countryLatin}>ISLAMIC REPUBLIC OF IRAN</Text>
        </View>
        <View style={s.headerRight}>
          <Image source={require('../../assets/lion-sun-square.png')} style={s.emblem} resizeMode="contain" />
          <Text style={s.docType}>گذرنامه</Text>
        </View>
      </View>

      {/* Body */}
      <View style={s.body}>
        <View style={s.photoBox}>
          <View style={s.photo}><Text style={s.photoTxt}>عکس</Text></View>
        </View>
        <View style={s.fields}>
          <PField label="نام خانوادگی" value={p.surname} />
          <PField label="نام" value={p.givenNames} />
          <PField label="ملیت" value={p.nationality} />
          <View style={s.row2}>
            <PField label="تاریخ تولد" value={fmtDate(p.dateOfBirth)} />
            <PField label="جنسیت" value={p.sex === 'M' ? 'مرد' : 'زن'} />
          </View>
          <View style={s.row2}>
            <PField label="شماره گذرنامه" value={p.passportNumber} mono />
            <PField label="انقضا" value={fmtDate(p.expiryDate)} alert={expired} />
          </View>
        </View>
      </View>

      {p.mrz1 || p.mrz2 ? (
        <View style={s.mrz}>
          {p.mrz1 ? <Text style={s.mrzLine}>{p.mrz1}</Text> : null}
          {p.mrz2 ? <Text style={s.mrzLine}>{p.mrz2}</Text> : null}
        </View>
      ) : null}

      <View style={[s.badge, expired ? s.badgeRed : s.badgeGreen]}>
        <Text style={s.badgeTxt}>{expired ? 'منقضی' : 'معتبر'}</Text>
      </View>
    </LinearGradient>
  );
}

function PField({ label, value, mono, alert }: { label: string; value: string; mono?: boolean; alert?: boolean }) {
  return (
    <View style={s.fieldItem}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={[s.fieldValue, mono && s.fieldMono, alert && { color: '#FF8A80' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16, padding: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },
  cornerTR: {
    position: 'absolute', top: -50, right: -50,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cornerBL: {
    position: 'absolute', bottom: -40, left: -40,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  countryFa: { color: '#fff', fontSize: 10, fontWeight: '700' },
  countryLatin: { color: 'rgba(255,255,255,0.5)', fontSize: 8, marginTop: 2 },
  headerRight: { alignItems: 'flex-end', gap: 2 },
  emblem: { width: 26, height: 26 },
  docType: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  body: { flexDirection: 'row', gap: 12, marginTop: 10, flex: 1 },
  photoBox: {},
  photo: {
    width: 58, height: 72, borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  photoTxt: { color: 'rgba(255,255,255,0.35)', fontSize: 8, fontWeight: '700' },
  fields: { flex: 1, gap: 5 },
  row2: { flexDirection: 'row', gap: 14 },
  fieldItem: {},
  fieldLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: '600', letterSpacing: 0.4 },
  fieldValue: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 1 },
  fieldMono: { color: '#A5D6A7', letterSpacing: 1, fontSize: 10 },
  mrz: {
    marginTop: 8, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)',
  },
  mrzLine: { color: 'rgba(255,255,255,0.7)', fontSize: 7, letterSpacing: 1.2, lineHeight: 12, fontFamily: 'monospace' },
  badge: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeGreen: { backgroundColor: 'rgba(26,122,74,0.85)' },
  badgeRed: { backgroundColor: 'rgba(176,32,32,0.85)' },
  badgeTxt: { color: '#fff', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
});
