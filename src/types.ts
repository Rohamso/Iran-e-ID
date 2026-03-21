export interface NationalIdCard {
  fullName: string;
  fullNameLatin: string;
  idNumber: string;
  dateOfBirth: string;
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
  nationality: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  expiryDate: string;
  personalNumber?: string;
  mrz1?: string;
  mrz2?: string;
}

export interface DrivingLicense {
  fullName: string;
  fullNameLatin: string;
  licenseNumber: string;
  dateOfBirth: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  categories: string;   // e.g. "A, B, C"
  placeOfBirth?: string;
  photoUri?: string;
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
  AddDrivingLicense: undefined;
};
