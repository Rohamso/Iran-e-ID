import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { NationalIdCard, Passport, DrivingLicense, VoteChoice, VoteStatus, VoteReceipt } from '../types';

const asyncStorage = createJSONStorage(() => AsyncStorage);

const secureStorage = createJSONStorage(() => ({
  getItem: (k: string) => SecureStore.getItemAsync(k),
  setItem: (k: string, v: string) => SecureStore.setItemAsync(k, v),
  removeItem: (k: string) => SecureStore.deleteItemAsync(k),
}));

// ─── Auth ────────────────────────────────────────────────────────────

interface AuthState {
  pin: string | null;
  isUnlocked: boolean;
  biometricsEnabled: boolean;
  onboardingDone: boolean;
  setPin: (pin: string) => void;
  unlock: () => void;
  lock: () => void;
  enableBiometrics: () => void;
  finishOnboarding: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      pin: null,
      isUnlocked: false,
      biometricsEnabled: false,
      onboardingDone: false,
      setPin: (pin) => set({ pin, isUnlocked: true }),
      unlock: () => set({ isUnlocked: true }),
      lock: () => set({ isUnlocked: false }),
      enableBiometrics: () => set({ biometricsEnabled: true }),
      finishOnboarding: () => set({ onboardingDone: true }),
      reset: () => set({ pin: null, isUnlocked: false, biometricsEnabled: false, onboardingDone: false }),
    }),
    { name: 'auth', storage: asyncStorage },
  ),
);

// ─── Identity ────────────────────────────────────────────────────────

interface IdentityState {
  idCard: NationalIdCard | null;
  passport: Passport | null;
  drivingLicense: DrivingLicense | null;
  setIdCard: (card: NationalIdCard) => void;
  clearIdCard: () => void;
  setPassport: (passport: Passport) => void;
  clearPassport: () => void;
  setDrivingLicense: (license: DrivingLicense) => void;
  clearDrivingLicense: () => void;
  clearAll: () => void;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      idCard: null,
      passport: null,
      drivingLicense: null,
      setIdCard: (card) => set({ idCard: card }),
      clearIdCard: () => set({ idCard: null }),
      setPassport: (passport) => set({ passport }),
      clearPassport: () => set({ passport: null }),
      setDrivingLicense: (license) => set({ drivingLicense: license }),
      clearDrivingLicense: () => set({ drivingLicense: null }),
      clearAll: () => set({ idCard: null, passport: null, drivingLicense: null }),
    }),
    { name: 'identity', storage: secureStorage },
  ),
);

// ─── Referendum ──────────────────────────────────────────────────────

interface ReferendumState {
  choice: VoteChoice | null;
  status: VoteStatus;
  receipt: VoteReceipt | null;
  selectChoice: (c: VoteChoice) => void;
  submitVote: () => void;
  confirmVote: (receipt: VoteReceipt) => void;
  resetVote: () => void;
}

export const useReferendumStore = create<ReferendumState>()(
  persist(
    (set) => ({
      choice: null,
      status: 'pending',
      receipt: null,
      selectChoice: (choice) => set({ choice }),
      submitVote: () => set({ status: 'submitting' }),
      confirmVote: (receipt) => set({ status: 'done', receipt }),
      resetVote: () => set({ choice: null, status: 'pending', receipt: null }),
    }),
    { name: 'referendum', storage: secureStorage },
  ),
);
