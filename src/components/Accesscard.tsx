import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { AccessRecordWithStudent } from '../types';
import { formatDate, formatTime } from '../utils/dateFormatter';

interface Props {
  record: AccessRecordWithStudent;
  onPress?: () => void;
}

export function AccessCard({ record, onPress }: Props) {
  const isEntry = record.type === 'entry';
  const isDenied = !record.authorized;

  const statusColor = isDenied
    ? COLORS.danger
    : isEntry
    ? COLORS.secondary
    : COLORS.primary;

  const statusBg = isDenied
    ? COLORS.dangerLight
    : isEntry
    ? COLORS.secondaryLight
    : COLORS.primaryLight;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <Image source={{ uri: record.student.photo }} style={styles.photo} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{record.student.name}</Text>
        <Text style={styles.career} numberOfLines={1}>{record.student.career}</Text>
        <View style={styles.meta}>
          <Text style={styles.gate}>{record.gate}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{formatTime(record.timestamp)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.date}>{formatDate(record.timestamp)}</Text>
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: statusBg }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {isDenied ? 'Denegado' : isEntry ? 'Ingreso' : 'Salida'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photo: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  info: { flex: 1, marginHorizontal: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textPrimary },
  career: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  gate: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  dot: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginHorizontal: 3 },
  time: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  date: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
});