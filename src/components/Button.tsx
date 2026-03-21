import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius } from '../theme';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'gold';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  full?: boolean;
}

const AP = Animated.createAnimatedComponent(Pressable);

export function Button({ label, onPress, variant = 'primary', disabled, loading, icon, full = true }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AP
      style={[styles.base, styles[variant], full && styles.full, (disabled || loading) && styles.disabled, anim]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={disabled || loading}
    >
      {loading
        ? <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.navy : '#fff'} />
        : <View style={styles.row}>
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
            <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles] as any]}>{label}</Text>
          </View>
      }
    </AP>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, paddingVertical: 15, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  full: { width: '100%' },
  disabled: { opacity: 0.45 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  // variants
  primary: { backgroundColor: colors.navy },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.navy },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.red },
  gold: { backgroundColor: colors.gold },
  // label colors
  label_primary: { color: '#fff' },
  label_outline: { color: colors.navy },
  label_ghost: { color: colors.navy },
  label_danger: { color: '#fff' },
  label_gold: { color: '#fff' },
});
