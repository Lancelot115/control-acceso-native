import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { FilterType } from '../hooks/useFilter';

interface Props {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'entry', label: 'Ingresos' },
  { key: 'exit', label: 'Salidas' },
  { key: 'denied', label: 'Denegados' },
];

export function FilterButton({ active, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.container}>
      {FILTERS.map(f => (
        <TouchableOpacity
          key={f.key}
          style={[styles.btn, active === f.key && styles.btnActive]}
          onPress={() => onChange(f.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, active === f.key && styles.textActive]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: SPACING.sm },
  container: { flexDirection: 'row', gap: SPACING.sm, paddingVertical: 2 },
  btn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: '500' },
  textActive: { color: COLORS.white, fontWeight: '600' },
});