import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Passport } from '../types';
import { fmtDate, isExpired } from '../helpers';

const W = Dimensions.get('window').width - 40;

export function PassportCard({ passport: p }: { passport: Passport }) {
  const expired = isExpired(p.expiryDate);
  return (
    <LinearGradient colors={['#133A1B', '#1F5C2E', '#2D7A42']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, { width: W }]}>
      <View style={s.header}>
        <View>
          <Text style={s.country}>جمهوری اسلامی ایران</Text>
          <Text style={s.countryLatin}>ISLAMIC REPUBLIC OF IRAN</Text>
        </View>
        <Image source={require('../../assets/lion-sun-square.png')} style={s.flag} resizeMode="contain" />
      </View>
      <Text style={s.docType}>گ ذ ر ن ا م ه</Text>

      <View style={s.body}>
        <View style={s.photoBox}>
          <View style={s.photo}><Text style={s.photoTxt}>عکس</Text></View>
        </View>
        <View style={s.fields}>
          <Row label="نام خانوادگی" value={p.surname} />
          <Row label="نام" value={p.givenNames} />
          <Row label="ملیت" value={p.nationality} />
          <View style={s.twoCol}>
            <Row label="تاریخ تولد" value={fmtDate(p.dateOfBirth)} />
            <Row label="جنسیت" value={p.sex === 'M' ? 'مرد' : 'زن'} />
          </View>
          <View style={s.twoCol}>
            <Row label="شماره گذرنامه" value={p.passportNumber} />
            <Row label="انقضا" value={fmtDate(p.expiryDate)} error={expired} />
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

function Row({ label, value, error }: { label: string; value: string; error?: boolean }) {
  return (
    <View style={s.row}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={[s.val, error && { color: '#FF8A80' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  country: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  countryLatin: { color: 'rgba(255,255,255,0.55)', fontSize: 8, marginTop: 2 },
  flag: { width: 28, height: 28 },
  docType: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700', letterSpacing: 4, marginVertical: 10 },
  body: { flexDirection: 'row', gap: 14 },
  photoBox: {},
  photo: { width: 64, height: 80, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  photoTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700' },
  fields: { flex: 1 },
  row: { marginBottom: 6 },
  twoCol: { flexDirection: 'row', gap: 16 },
  lbl: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '600', letterSpacing: 0.3 },
  val: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 1 },
  mrz: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  mrzLine: { color: 'rgba(255,255,255,0.8)', fontSize: 8, letterSpacing: 1, lineHeight: 14, fontFamily: 'monospace' },
  badge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeGreen: { backgroundColor: 'rgba(26,122,74,0.9)' },
  badgeRed: { backgroundColor: 'rgba(176,32,32,0.9)' },
  badgeTxt: { color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
});
