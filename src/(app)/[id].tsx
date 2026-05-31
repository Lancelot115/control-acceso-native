import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING, STATUS_COLORS, STATUS_LABELS } from '../constants';
import { accessService } from '../services/accessService';
import { AccessRecordWithStudent, Student } from '../types';
import { formatDateTime } from '../utils/dateFormatter';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [records, setRecords] = useState<AccessRecordWithStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      accessService.getStudentById(id),
      accessService.getRecords(),
    ]).then(([s, recs]) => {
      setStudent(s);
      setRecords(recs.filter(r => r.studentId === id));
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.danger} />
        <Text style={styles.notFoundText}>Estudiante no encontrado</Text>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[student.status];
  const statusLabel = STATUS_LABELS[student.status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: student.photo }} style={styles.photo} />
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.career}>{student.career}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <InfoRow icon="id-card-outline" label="ID" value={student.id} />
        <InfoRow icon="school-outline" label="Carrera" value={student.career} />
        <InfoRow
          icon="car-outline"
          label="Vehículo"
          value={student.vehicle ? `${student.vehicle} (${student.vehicleType})` : 'No registrado'}
        />
      </View>

      {/* History */}
      <Text style={styles.sectionTitle}>Historial de accesos ({records.length})</Text>
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sin registros para este estudiante</Text>
        </View>
      ) : (
        records.map(r => (
          <View key={r.id} style={styles.recordRow}>
            <View style={[styles.recordIcon, { backgroundColor: r.authorized ? (r.type === 'entry' ? COLORS.secondaryLight : COLORS.primaryLight) : COLORS.dangerLight }]}>
              <Ionicons
                name={r.authorized ? (r.type === 'entry' ? 'log-in-outline' : 'log-out-outline') : 'close-circle-outline'}
                size={18}
                color={r.authorized ? (r.type === 'entry' ? COLORS.secondary : COLORS.primary) : COLORS.danger}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordType}>
                {r.authorized ? (r.type === 'entry' ? 'Ingreso' : 'Salida') : 'Acceso denegado'}
                {' · '}{r.gate}
              </Text>
              <Text style={styles.recordTime}>{formatDateTime(r.timestamp)}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  notFoundText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  photo: { width: 90, height: 90, borderRadius: 45, marginBottom: SPACING.md, backgroundColor: COLORS.border },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textPrimary },
  career: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: RADIUS.full },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, width: 80 },
  infoValue: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: '500' },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  recordIcon: { width: 36, height: 36, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  recordType: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textPrimary },
  recordTime: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted },
});