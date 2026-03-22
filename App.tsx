import React from 'react';
import { I18nManager, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/navigation';

// Force RTL layout for Farsi
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Vazirmatn-Regular': require('./assets/fonts/Vazirmatn-Regular.ttf'),
    'Vazirmatn-Medium':  require('./assets/fonts/Vazirmatn-Medium.ttf'),
    'Vazirmatn-Bold':    require('./assets/fonts/Vazirmatn-Bold.ttf'),
  });

  if (!fontsLoaded) return <View style={{ flex: 1 }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
