import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useIdentityStore } from '../store';
import { colors, radius, space } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddId'>;

const schema = z.object({
  fullName: z.string().min(2),
  fullNameLatin: z.string().min(2),
  idNumber: z.string().regex(/^\d{10}$/, 'باید دقیقاً ۱۰ رقم باشد'),
  dateOfBirth: z.string().min(1),
  fatherName: z.string().min(1),
  placeOfBirth: z.string().min(1),
  gender: z.enum(['M', 'F']),
  serialNumber: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().min(1),
});
type Form = z.infer<typeof schema>;

export default function AddIdScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const { setIdCard } = useIdentityStore();
  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'M' },
  });

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [3, 4] });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const save = (data: Form) => {
    setIdCard({ ...data, photoUri });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.hdr}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backTxt}>→</Text>
            </Pressable>
            <Text style={styles.title}>کارت ملی</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Photo picker */}
          <Pressable onPress={pickPhoto} style={styles.photoPicker}>
            <Text style={styles.photoIcon}>{photoUri ? '✅' : '📷'}</Text>
            <Text style={styles.photoTxt}>{photoUri ? 'عکس انتخاب شد' : 'افزودن عکس (اختیاری)'}</Text>
          </Pressable>

          <Controller control={control} name="fullName" render={({ field, fieldState }) => (
            <Input label="نام کامل (فارسی) *" placeholder="نام و نام خانوادگی" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="fullNameLatin" render={({ field, fieldState }) => (
            <Input label="نام کامل (لاتین) *" placeholder="e.g. Ali Mohammadi" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="idNumber" render={({ field, fieldState }) => (
            <Input label="کد ملی *" placeholder="۱۰ رقم" keyboardType="numeric" maxLength={10} value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="dateOfBirth" render={({ field, fieldState }) => (
            <Input label="تاریخ تولد * (YYYY-MM-DD)" placeholder="1985-06-15" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="fatherName" render={({ field, fieldState }) => (
            <Input label="نام پدر *" placeholder="نام پدر" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="placeOfBirth" render={({ field, fieldState }) => (
            <Input label="محل تولد *" placeholder="مثلاً تهران" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />

          <Text style={styles.genderLabel}>جنسیت *</Text>
          <Controller control={control} name="gender" render={({ field }) => (
            <View style={styles.genderRow}>
              {(['M', 'F'] as const).map(g => (
                <Pressable key={g} style={[styles.genderBtn, field.value === g && styles.genderBtnOn]} onPress={() => field.onChange(g)}>
                  <Text style={[styles.genderTxt, field.value === g && styles.genderTxtOn]}>{g === 'M' ? '♂ مرد' : '♀ زن'}</Text>
                </Pressable>
              ))}
            </View>
          )} />

          <Controller control={control} name="serialNumber" render={({ field, fieldState }) => (
            <Input label="شماره سریال *" placeholder="شماره سریال کارت" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="issueDate" render={({ field, fieldState }) => (
            <Input label="تاریخ صدور * (YYYY-MM-DD)" placeholder="2018-03-20" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="expiryDate" render={({ field, fieldState }) => (
            <Input label="تاریخ انقضا * (YYYY-MM-DD)" placeholder="2028-03-20" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />

          <View style={{ marginTop: 8 }}>
            <Button label="ذخیره کارت ملی" onPress={handleSubmit(save)} />
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
  photoPicker: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', marginBottom: 16 },
  photoIcon: { fontSize: 24 },
  photoTxt: { fontSize: 14, color: colors.textSub, fontWeight: '600' },
  genderLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  genderBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.sm, backgroundColor: colors.white, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  genderBtnOn: { borderColor: colors.navy, backgroundColor: '#EBF2FA' },
  genderTxt: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  genderTxtOn: { color: colors.navy },
});
