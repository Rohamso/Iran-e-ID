import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { colors, radius, shadow } from '../theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  onComplete?: (v: string) => void;
}

const ROWS = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];

export function NumPad({ value, onChange, length = 6, onComplete }: Props) {
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
  };

  const press = (k: string) => {
    if (k === '⌫') { onChange(value.slice(0, -1)); return; }
    if (!k) return;
    if (value.length >= length) { shake(); return; }
    const next = value + k;
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.dots, shakeStyle]}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={[styles.dot, i < value.length && styles.dotFilled]} />
        ))}
      </Animated.View>
      <View style={styles.grid}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((k, ki) => (
              <Pressable
                key={ki}
                style={({ pressed }) => [styles.key, k === '' && styles.keyEmpty, pressed && k && styles.keyDown]}
                onPress={() => press(k)}
                disabled={!k}
              >
                <Text style={[styles.keyTxt, k === '⌫' && styles.keyDel]}>{k}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 32 },
  dots: { flexDirection: 'row', gap: 18, marginBottom: 36 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.navy, backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: colors.navy },
  grid: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  key: {
    width: 80, height: 74, borderRadius: radius.lg,
    backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center',
    ...shadow.sm,
  },
  keyEmpty: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  keyDown: { backgroundColor: colors.border },
  keyTxt: { fontSize: 24, fontWeight: '600', color: colors.text },
  keyDel: { fontSize: 20, color: colors.textSub },
});
