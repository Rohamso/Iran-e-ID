import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIdentityStore } from '../store';
import { IdCard } from '../components/IdCard';
import { PassportCard } from '../components/PassportCard';
import { Button } from '../components/Button';
import { colors, radius, shadow, space } from '../theme';
import { fmtDate } from '../helpers';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function IdentityScreen() {
  const nav = useNavigation<Nav>();
  const { idCard, passport, clearIdCard, clearPassport } = useIdentityStore();
  const [tab, setTab] = useState<'id' | 'passport'>('id');
  const hasAny = !!(idCard || passport);

  if (!hasAny) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🪪</Text>
          <Text style={styles.emptyTitle}>هنوز مدرکی نیست</Text>
          <Text style={styles.emptySub}>کارت ملی یا گذرنامه خود را برای شروع اضافه کنید.</Text>
          <Button label="افزودن کارت ملی" onPress={() => nav.navigate('AddId')} full={false} />
          <Button label="افزودن گذرنامه" onPress={() => nav.navigate('AddPassport')} variant="outline" full={false} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hdr}>
          <Text style={styles.title}>مدارک من</Text>
          <View style={styles.hdrBtns}>
            <Pressable style={styles.addBtn} onPress={() => nav.navigate('AddId')}>
              <Text style={styles.addBtnTxt}>+ کارت ملی</Text>
            </Pressable>
            <Pressable style={styles.addBtn} onPress={() => nav.navigate('AddPassport')}>
              <Text style={styles.addBtnTxt}>+ گذرنامه</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab selector */}
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, tab === 'id' && styles.tabActive]} onPress={() => setTab('id')}>
            <Text style={[styles.tabTxt, tab === 'id' && styles.tabTxtActive]}>🪪 کارت ملی</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'passport' && styles.tabActive]} onPress={() => setTab('passport')}>
            <Text style={[styles.tabTxt, tab === 'passport' && styles.tabTxtActive]}>📘 گذرنامه</Text>
          </Pressable>
        </View>

        {tab === 'id' ? (
          idCard ? (
            <View style={styles.cardSection}>
              <IdCard card={idCard} />
              <Text style={styles.hint}>برای دیدن پشت کارت ضربه بزنید</Text>
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>جزئیات مدرک</Text>
                {[
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
                ].map(([k, v]) => (
                  <View key={k} style={styles.detailRow}>
                    <Text style={styles.detailKey}>{k}</Text>
                    <Text style={styles.detailVal}>{v}</Text>
                  </View>
                ))}
                <Button label="حذف کارت ملی" variant="danger" onPress={clearIdCard} />
              </View>
            </View>
          ) : (
            <View style={styles.missing}>
              <Text style={styles.missingTxt}>کارت ملی اضافه نشده است.</Text>
              <Button label="افزودن کارت ملی" onPress={() => nav.navigate('AddId')} full={false} />
            </View>
          )
        ) : (
          passport ? (
            <View style={styles.cardSection}>
              <PassportCard passport={passport} />
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>جزئیات مدرک</Text>
                {[
                  ['نام خانوادگی', passport.surname],
                  ['نام', passport.givenNames],
                  ['شماره گذرنامه', passport.passportNumber],
                  ['ملیت', passport.nationality],
                  ['تاریخ تولد', fmtDate(passport.dateOfBirth)],
                  ['جنسیت', passport.sex === 'M' ? 'مرد' : 'زن'],
                  ['تاریخ انقضا', fmtDate(passport.expiryDate)],
                  passport.personalNumber ? ['شماره شخصی', passport.personalNumber] : null,
                ].filter((row): row is string[] => row !== null).map(([k, v]) => (
                  <View key={k} style={styles.detailRow}>
                    <Text style={styles.detailKey}>{k}</Text>
                    <Text style={styles.detailVal}>{v}</Text>
                  </View>
                ))}
                <Button label="حذف گذرنامه" variant="danger" onPress={clearPassport} />
              </View>
            </View>
          ) : (
            <View style={styles.missing}>
              <Text style={styles.missingTxt}>گذرنامه اضافه نشده است.</Text>
              <Button label="افزودن گذرنامه" onPress={() => nav.navigate('AddPassport')} full={false} />
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 40, gap: space.md },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  hdrBtns: { flexDirection: 'row', gap: 8 },
  addBtn: { backgroundColor: '#EBF2FA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnTxt: { color: colors.navy, fontSize: 12, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: '#E8ECF0', borderRadius: radius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.white, ...shadow.sm },
  tabTxt: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabTxtActive: { color: colors.text },
  cardSection: { gap: space.md, alignItems: 'center' },
  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  detailCard: { width: '100%', backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 4, ...shadow.sm },
  detailTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  detailKey: { fontSize: 13, color: colors.textSub, flex: 1 },
  detailVal: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  missing: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed' },
  missingTxt: { fontSize: 15, color: colors.textSub },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 16 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  emptySub: { fontSize: 15, color: colors.textSub, textAlign: 'center', lineHeight: 24 },
});
