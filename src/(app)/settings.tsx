import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationCenter } from '../components/Notificationcenter';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role === 'admin' ? 'Administrador' : 'Guardia'}</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <NotificationCenter
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onClearAll={clearAll}
        />
      </View>

      {/* App info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoLabel}>Aplicación</Text>
          <Text style={styles.infoValue}>Control de Acceso Campus</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="code-slash-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoLabel}>Versión</Text>
          <Text style={styles.infoValue}>1.0.0 (Avance 02)</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="server-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoLabel}>API</Text>
          <Text style={styles.infoValue}>Mock local (JSON)</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  userName: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textPrimary },
  userEmail: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  roleBadge: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-start' },
  roleText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '700' },
  section: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textPrimary },
  badge: { backgroundColor: COLORS.danger, borderRadius: RADIUS.full, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: FONT_SIZE.xs, color: COLORS.white, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, width: 90 },
  infoValue: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.danger + '44',
  },
  logoutText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.danger },
});