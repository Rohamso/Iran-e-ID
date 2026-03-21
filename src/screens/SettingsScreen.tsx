import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert } from 'react-native';
import { useAuthStore, useIdentityStore, useReferendumStore } from '../store';
import { colors, radius, shadow, space } from '../theme';

export default function SettingsScreen() {
  const { reset: resetAuth } = useAuthStore();
  const { clearAll } = useIdentityStore();
  const { resetVote } = useReferendumStore();

  const deleteAll = () => {
    Alert.alert('حذف همه اطلاعات', 'این عمل همه مدارک و سوابق رای شما را برای همیشه حذف می‌کند. قابل بازگشت نیست.', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف همه', style: 'destructive', onPress: () => { clearAll(); resetVote(); resetAuth(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>تنظیمات</Text>

        <Section title="امنیت">
          <Row icon="🔑" label="تغییر رمز PIN" onPress={() => Alert.alert('به زودی', 'تغییر رمز PIN در به‌روزرسانی بعدی.')} />
          <Div />
          <Row icon="👆" label="ورود با بیومتریک" onPress={() => Alert.alert('به زودی', 'تنظیم بیومتریک در به‌روزرسانی بعدی.')} />
        </Section>

        <Section title="درباره">
          <Row icon="📱" label="نسخه" value="1.0.0" />
          <Div />
          <Row icon="📜" label="شرایط استفاده" onPress={() => {}} />
          <Div />
          <Row icon="🔒" label="سیاست حریم خصوصی" onPress={() => {}} />
        </Section>

        <Section title="منطقه خطر">
          <Pressable onPress={deleteAll} style={styles.dangerRow}>
            <Text style={styles.dangerTxt}>🗑️  حذف همه اطلاعات</Text>
            <Text style={[styles.rowArrow, { color: colors.red }]}>←</Text>
          </Pressable>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerTxt}>Iran e-ID · هویت دیجیتال امن</Text>
          <Text style={styles.footerFa}>هویت دیجیتال ایرانیان</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ icon, label, value, onPress }: { icon: string; label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowLabel}>{icon}  {label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : <Text style={styles.rowArrow}>←</Text>}
    </Pressable>
  );
}
function Div() { return <View style={styles.div} />; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 48 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 8 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', ...shadow.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  rowLabel: { fontSize: 15, color: colors.text },
  rowValue: { fontSize: 14, color: colors.textMuted },
  rowArrow: { fontSize: 16, color: colors.textMuted },
  div: { height: 1, backgroundColor: '#F0F2F5', marginLeft: 16 },
  dangerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  dangerTxt: { fontSize: 15, color: colors.red, fontWeight: '600' },
  footer: { alignItems: 'center', gap: 4, marginTop: 8 },
  footerTxt: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  footerFa: { fontSize: 12, color: '#C0C8D0' },
});
