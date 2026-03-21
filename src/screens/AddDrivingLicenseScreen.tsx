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

type Props = NativeStackScreenProps<RootStackParamList, 'AddDrivingLicense'>;

const schema = z.object({
  fullName: z.string().min(2),
  fullNameLatin: z.string().min(2),
  licenseNumber: z.string().min(4),
  dateOfBirth: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().min(1),
  issuingAuthority: z.string().min(1),
  categories: z.string().min(1),
  placeOfBirth: z.string().optional().default(''),
});
type Form = z.infer<typeof schema>;

const CAT_OPTIONS = ['A1', 'A', 'B', 'B1', 'C', 'C1', 'D', 'D1'];

export default function AddDrivingLicenseScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const { setDrivingLicense } = useIdentityStore();
  const { control, handleSubmit, setValue } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { categories: '' },
  });

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [3, 4] });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const toggleCat = (cat: string) => {
    const next = selectedCats.includes(cat)
      ? selectedCats.filter(c => c !== cat)
      : [...selectedCats, cat];
    setSelectedCats(next);
    setValue('categories', next.join(', '));
  };

  const save = (data: Form) => {
    setDrivingLicense({ ...data, photoUri });
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
            <Text style={styles.title}>گواهینامه رانندگی</Text>
            <View style={{ width: 36 }} />
          </View>

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
          <Controller control={control} name="licenseNumber" render={({ field, fieldState }) => (
            <Input label="شماره گواهینامه *" placeholder="شماره گواهینامه" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="dateOfBirth" render={({ field, fieldState }) => (
            <Input label="تاریخ تولد * (YYYY-MM-DD)" placeholder="1985-06-15" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="issuingAuthority" render={({ field, fieldState }) => (
            <Input label="مرجع صادرکننده *" placeholder="مثلاً راهور ناجا" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="issueDate" render={({ field, fieldState }) => (
            <Input label="تاریخ صدور * (YYYY-MM-DD)" placeholder="2015-04-10" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="expiryDate" render={({ field, fieldState }) => (
            <Input label="تاریخ انقضا * (YYYY-MM-DD)" placeholder="2025-04-10" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )} />

          {/* Category selector */}
          <Text style={styles.catLabel}>دسته‌بندی گواهینامه *</Text>
          <View style={styles.catGrid}>
            {CAT_OPTIONS.map(cat => (
              <Pressable
                key={cat}
                style={[styles.catBtn, selectedCats.includes(cat) && styles.catBtnOn]}
                onPress={() => toggleCat(cat)}
              >
                <Text style={[styles.catTxt, selectedCats.includes(cat) && styles.catTxtOn]}>{cat}</Text>
              </Pressable>
            ))}
          </View>

          <Controller control={control} name="placeOfBirth" render={({ field }) => (
            <Input label="محل تولد (اختیاری)" placeholder="مثلاً تهران" value={field.value} onChangeText={field.onChange} />
          )} />

          <View style={{ marginTop: 8 }}>
            <Button label="ذخیره گواهینامه" onPress={handleSubmit(save)} />
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
  photoPicker: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', marginBottom: 16 },
  photoIcon: { fontSize: 24 },
  photoTxt: { fontSize: 14, color: colors.textSub, fontWeight: '600' },
  catLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 10 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  catBtnOn: { borderColor: colors.teal, backgroundColor: colors.tealLight },
  catTxt: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  catTxtOn: { color: colors.teal },
});
