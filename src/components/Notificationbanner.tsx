import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { Notification } from '../types';

interface Props {
  notification: Notification | null;
}

const CONFIG = {
  success: { icon: 'checkmark-circle', color: COLORS.secondary, bg: COLORS.secondaryLight },
  error: { icon: 'close-circle', color: COLORS.danger, bg: COLORS.dangerLight },
  warning: { icon: 'warning', color: COLORS.warning, bg: COLORS.warningLight },
  info: { icon: 'information-circle', color: COLORS.primary, bg: COLORS.primaryLight },
};

export function NotificationBanner({ notification }: Props) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!notification) return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(2800),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [notification]);

  if (!notification) return null;
  const cfg = CONFIG[notification.type];

  return (
    <Animated.View style={[styles.container, { backgroundColor: cfg.bg, transform: [{ translateY }], opacity }]}>
      <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
      <View style={styles.texts}>
        <Text style={[styles.title, { color: cfg.color }]}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  texts: { flex: 1 },
  title: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  message: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 1 },
});