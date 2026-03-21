import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useIdentityStore } from '../store';
import { colors, radius, space } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPassport'>;

const schema = z.object({
  surname: z.string().min(1),
  givenNames: z.string().min(1),
  passportNumber: z.string().min(6),
  nationality: z.string().length(3, 'باید ۳ حرف باشد، مثلاً IRN'),
  dateOfBirth: z.string().min(1),
  sex: z.enum(['M', 'F']),
  expiryDate: z.string().min(1),
  personalNumber: z.string().optional().default(''),
  mrz1: z.string().optional().default(''),
  mrz2: z.string().optional().default(''),
});
type Form = z.infer<typeof schema>;

export default function AddPassportScreen({ navigation }: Props) {
  const { setPassport } = useIdentityStore();
  const { control, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema) as any,
    defaultValues: { sex: 'M', nationality: 'IRN', personalNumber: '', mrz1: '', mrz2: '' },
  });

  const save = (data: Form) => {
    setPassport({ ...data, sex: data.sex as 'M' | 'F' });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hdr}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backTxt}>→</Text>
            </Pressable>
            <Text style={styles.title}>گذرنامه</Text>
            <View style={{ width: 36 }} />
          </View>

          <Controller control={control} name="surname" render={({ field, fieldState }) => (
            <Input label="نام خانوادگی *" placeholder="MOHAMMADI" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="givenNames" render={({ field, fieldState }) => (
            <Input label="نام *" placeholder="ALI" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="passportNumber" render={({ field, fieldState }) => (
            <Input label="شماره گذرنامه *" placeholder="A12345678" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="nationality" render={({ field, fieldState }) => (
            <Input label="کد ملیت * (۳ حرف)" placeholder="IRN" value={field.value} onChangeText={t => field.onChange(t.toUpperCase())} maxLength={3} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="dateOfBirth" render={({ field, fieldState }) => (
            <Input label="تاریخ تولد * (YYYY-MM-DD)" placeholder="1985-06-15" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />

          <Text style={styles.genderLabel}>جنسیت *</Text>
          <Controller control={control} name="sex" render={({ field }) => (
            <View style={styles.genderRow}>
              {(['M', 'F'] as const).map(g => (
                <Pressable key={g} style={[styles.genderBtn, field.value === g && styles.genderBtnOn]} onPress={() => field.onChange(g)}>
                  <Text style={[styles.genderTxt, field.value === g && styles.genderTxtOn]}>{g === 'M' ? '♂ مرد' : '♀ زن'}</Text>
                </Pressable>
              ))}
            </View>
          )} />

          <Controller control={control} name="expiryDate" render={({ field, fieldState }) => (
            <Input label="تاریخ انقضا * (YYYY-MM-DD)" placeholder="2030-01-15" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="personalNumber" render={({ field }) => (
            <Input label="کد ملی / شماره شخصی" placeholder="اختیاری" value={field.value} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="mrz1" render={({ field }) => (
            <Input label="خط MRZ ۱ (اختیاری)" placeholder="P<IRNMOHAMMADI<<ALI<..." value={field.value} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="mrz2" render={({ field }) => (
            <Input label="خط MRZ ۲ (اختیاری)" placeholder="A12345678<IRN..." value={field.value} onChangeText={field.onChange} />
          )} />

          <View style={{ marginTop: 8 }}>
            <Button label="ذخیره گذرنامه" onPress={handleSubmit(save)} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingBottom: 48 },
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8ECF0', justifyContent: 'center', alignItems: 'center' },
  backTxt: { fontSize: 18, color: colors.text },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  genderLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  genderBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.sm, backgroundColor: colors.white, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  genderBtnOn: { borderColor: colors.navy, backgroundColor: '#EBF2FA' },
  genderTxt: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  genderTxtOn: { color: colors.navy },
});
