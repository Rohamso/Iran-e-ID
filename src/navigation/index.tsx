import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store';

import WelcomeScreen    from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SetPinScreen     from '../screens/SetPinScreen';
import UnlockScreen     from '../screens/UnlockScreen';
import HomeScreen       from '../screens/HomeScreen';
import IdentityScreen   from '../screens/IdentityScreen';
import VoteScreen       from '../screens/VoteScreen';
import SettingsScreen   from '../screens/SettingsScreen';
import AddIdScreen      from '../screens/AddIdScreen';
import AddPassportScreen from '../screens/AddPassportScreen';

import type { RootStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.border, height: 80, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     options={{ tabBarLabel: 'خانه',     tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Identity" component={IdentityScreen} options={{ tabBarLabel: 'هویت',    tabBarIcon: ({ focused }) => <TabIcon emoji="🪪" focused={focused} /> }} />
      <Tab.Screen name="Vote"     component={VoteScreen}     options={{ tabBarLabel: 'رای',      tabBarIcon: ({ focused }) => <TabIcon emoji="🗳️" focused={focused} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'تنظیمات', tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { pin, isUnlocked } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!pin ? (
          // First launch — onboarding + PIN setup
          <>
            <Stack.Screen name="Welcome"    component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="SetPin"     component={SetPinScreen} />
          </>
        ) : !isUnlocked ? (
          // Has PIN but locked
          <Stack.Screen name="Unlock" component={UnlockScreen} />
        ) : (
          // Unlocked — main app
          <>
            <Stack.Screen name="Main"        component={MainTabs} />
            <Stack.Screen name="AddId"       component={AddIdScreen}       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="AddPassport" component={AddPassportScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
