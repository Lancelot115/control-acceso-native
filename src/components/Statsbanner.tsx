import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { Stats } from '../types';

interface Props {
  stats: Stats;
}

const StatItem = ({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: any;
  value: number;
  label: string;
  color: string;
  bg: string;
}) => (
  <View style={[styles.statItem, { backgroundColor: bg }]}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export function StatsBanner({ stats }: Props) {
  return (
    <View style={styles.container}>
      <StatItem icon="log-in-outline" value={stats.totalEntries} label="Ingresos" color={COLORS.secondary} bg={COLORS.secondaryLight} />
      <StatItem icon="log-out-outline" value={stats.totalExits} label="Salidas" color={COLORS.primary} bg={COLORS.primaryLight} />
      <StatItem icon="close-circle-outline" value={stats.denied} label="Denegados" color={COLORS.danger} bg={COLORS.dangerLight} />
      <StatItem icon="car-outline" value={stats.vehiclesInside} label="Vehículos" color={COLORS.warning} bg={COLORS.warningLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 2,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});