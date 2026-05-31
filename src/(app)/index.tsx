import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AccessCard } from '../components/Accesscard';
import { LoadingSpinner } from '../components/Loadingspinner';
import { NotificationBanner } from '../components/Notificationbanner';
import { StatsBanner } from '../components/Statsbanner';
import { COLORS, FONT_SIZE, GATES, RADIUS, SPACING } from '../constants';
import { useAccessData } from '../hooks/useAccessData';
import { accessService } from '../services/accessService';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

export default function DashboardScreen() {
  const { records, stats, loading, error, refetch } = useAccessData();
  const [modalVisible, setModalVisible] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [accessType, setAccessType] = useState<'entry' | 'exit'>('entry');
  const [method, setMethod] = useState<'pedestrian' | 'vehicle'>('pedestrian');
  const [gate, setGate] = useState(GATES[0]);
  const [registering, setRegistering] = useState(false);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const unsub = notificationService.subscribe(n => {
      setActiveNotification(n);
      setTimeout(() => setActiveNotification(null), 3500);
    });
    return unsub;
  }, []);

  const recent = records.slice(0, 5);

  const handleRegister = async () => {
    if (!studentId.trim()) return;
    setRegistering(true);
    try {
      const result = await accessService.registerAccess(
        studentId.trim().toUpperCase(),
        accessType,
        method,
        gate,
      );
      if (result.success) {
        notificationService.success('Acceso registrado', result.message);
        setModalVisible(false);
        setStudentId('');
        refetch();
      } else {
        notificationService.error('Acceso denegado', result.message);
      }
    } finally {
      setRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <NotificationBanner notification={activeNotification} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <View style={styles.welcomeRow}>
          <Text style={styles.welcome}>Hoy, {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          <TouchableOpacity style={styles.registerBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={18} color={COLORS.white} />
            <Text style={styles.registerBtnText}>Registrar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {stats && <StatsBanner stats={stats} />}

        {/* Recent */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos accesos</Text>
          <TouchableOpacity onPress={() => router.push('../(app)/history')}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <LoadingSpinner message="Cargando accesos..." />
        ) : error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refetch}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : recent.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Sin registros recientes</Text>
          </View>
        ) : (
          recent.map(r => (
            <AccessCard key={r.id} record={r} onPress={() => router.push(`../(app)/${r.studentId}`)} />
          ))
        )}
      </ScrollView>

      {/* Register Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Acceso</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>ID del Estudiante</Text>
            <TextInput
              style={styles.textInput}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Ej: E001"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>Tipo de acceso</Text>
            <View style={styles.toggleRow}>
              {(['entry', 'exit'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.toggleBtn, accessType === t && styles.toggleBtnActive]}
                  onPress={() => setAccessType(t)}
                >
                  <Text style={[styles.toggleText, accessType === t && styles.toggleTextActive]}>
                    {t === 'entry' ? 'Ingreso' : 'Salida'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Método</Text>
            <View style={styles.toggleRow}>
              {(['pedestrian', 'vehicle'] as const).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.toggleBtn, method === m && styles.toggleBtnActive]}
                  onPress={() => setMethod(m)}
                >
                  <Text style={[styles.toggleText, method === m && styles.toggleTextActive]}>
                    {m === 'pedestrian' ? 'Peatonal' : 'Vehículo'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Puerta</Text>
            <View style={styles.gateRow}>
              {GATES.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gateBtn, gate === g && styles.gateBtnActive]}
                  onPress={() => setGate(g)}
                >
                  <Text style={[styles.gateText, gate === g && styles.gateBtnActiveText]} numberOfLines={1}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleRegister} disabled={registering}>
              {registering ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.confirmBtnText}>Confirmar registro</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  welcome: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, flex: 1, textTransform: 'capitalize' },
  registerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  registerBtnText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textPrimary },
  seeAll: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.dangerLight, padding: SPACING.md, borderRadius: RADIUS.md },
  errorText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.danger },
  retryText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.lg * 2, borderTopRightRadius: RADIUS.lg * 2, padding: SPACING.lg, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textPrimary },
  fieldLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: SPACING.sm },
  textInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, fontSize: FONT_SIZE.md, color: COLORS.textPrimary },
  toggleRow: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  toggleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: '500' },
  toggleTextActive: { color: COLORS.white, fontWeight: '700' },
  gateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gateBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  gateBtnActive: { backgroundColor: COLORS.secondaryLight, borderColor: COLORS.secondary },
  gateText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  gateBtnActiveText: { color: COLORS.secondary, fontWeight: '600' },
  confirmBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  confirmBtnText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white },
});