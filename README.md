# 🦁 Iran e-ID — هویت دیجیتال ایرانیان

A best-in-class electronic identification and secure referendum voting app for iOS and Android, built with Expo and React Native. Fully in Persian (Farsi) with right-to-left layout.

---

## About

Iran e-ID is an open-source mobile application that gives Iranians a secure, private way to carry their digital identity — and when the time comes, to cast their vote in a free and verifiable national referendum.

Inspired by Estonia's e-ID system, Iran e-ID stores national ID card and passport data encrypted on-device, protected by PIN and biometrics. No servers. No cloud. Your data never leaves your phone.

This project is part of the efforts of the **[Lion & Sun Tech Association](https://www.lionandsuntech.org)** — a non-profit dedicated to building open digital infrastructure for a free Iran.

---

## Features

- **🪪 National ID Card** — Store your Iranian national ID card with a skeuomorphic flip-card UI showing front and back
- **📘 Passport** — Store your passport with MRZ line support
- **🔐 PIN + Biometric Lock** — 6-digit PIN and Face ID / fingerprint protection
- **🗳️ Referendum Voting** — Cast a secure, anonymous vote: Constitutional Monarchy (مشروطه سلطنتی) or Republic (جمهوری)
- **🔒 On-device Encryption** — All identity data encrypted with `expo-secure-store`
- **🇮🇷 Full Farsi UI** — Complete Persian translation with native RTL layout
- **📱 iOS & Android** — Built with Expo SDK 55

---

## Screenshots

| خوش‌آمدگویی | هویت | رای |
|---|---|---|
| Welcome & onboarding | ID card & passport | Referendum voting |

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo SDK 55 / React Native 0.83 |
| Navigation | React Navigation (native stack + bottom tabs) |
| Animations | react-native-reanimated 4.2 |
| State | Zustand + persist |
| Storage | expo-secure-store (PII), AsyncStorage (prefs) |
| Forms | React Hook Form + Zod |
| Biometrics | expo-local-authentication |
| RTL | I18nManager.forceRTL |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- Android Studio (for Android) or Xcode (for iOS)

### Install & Run

```bash
git clone https://github.com/Rohamso/Iran-e-ID.git
cd Iran-e-ID
npm install
npx expo start
```

For Android emulator:
```bash
npx expo run:android
```

For iOS simulator:
```bash
npx expo run:ios
```

---

## Privacy

- All data is stored **locally on your device** using encrypted secure storage
- No analytics, no telemetry, no backend
- No account required
- Open source — audit the code yourself

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

This project follows the mission of the **[Lion & Sun Tech Association](https://www.lionandsuntech.org)** to build transparent, open, and trustworthy digital tools for Iranians everywhere.

---

## Product Requirements Document

The full PRD — including vision, feature specs, known gaps, and the v1.1 → v3.0 roadmap — is available here:

[View PRD on CryptPad](https://cryptpad.fr/doc/#/2/doc/view/C87KREzmdespxAvRmTo8F0YGyb9Ol9DhWQmLlRHi1sc/)

---

## License

MIT

---

<div align="center">

**Lion & Sun Tech Association**

[lionandsuntech.org](https://www.lionandsuntech.org)

*برای ایرانی آزاد — For a Free Iran*

</div>
