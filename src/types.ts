export interface NationalIdCard {
  fullName: string;        // Persian
  fullNameLatin: string;
  idNumber: string;        // 10-digit کد ملی
  dateOfBirth: string;     // YYYY-MM-DD
  fatherName: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  serialNumber: string;
  issueDate: string;
  expiryDate: string;
  photoUri?: string;
}

export interface Passport {
  surname: string;
  givenNames: string;
  passportNumber: string;
  nationality: string;     // e.g. IRN
  dateOfBirth: string;
  sex: 'M' | 'F';
  expiryDate: string;
  personalNumber?: string;
  mrz1?: string;
  mrz2?: string;
}

export type VoteChoice = 'monarchy' | 'republic';
export type VoteStatus = 'pending' | 'submitting' | 'done' | 'error';

export interface VoteReceipt {
  id: string;
  choice: VoteChoice;
  timestamp: number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  SetPin: undefined;
  Unlock: undefined;
  Main: undefined;
  AddId: undefined;
  AddPassport: undefined;
};
