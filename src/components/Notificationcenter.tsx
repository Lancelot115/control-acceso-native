import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { Notification } from '../types';
import { timeAgo } from '../utils/dateFormatter';

interface Props {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const ICONS = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};
const ICON_COLORS = {
  success: COLORS.secondary,
  error: COLORS.danger,
  warning: COLORS.warning,
  info: COLORS.primary,
};

export function NotificationCenter({ notifications, onMarkAllRead, onClearAll }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onMarkAllRead}>
            <Text style={styles.action}>Marcar leídas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClearAll}>
            <Text style={[styles.action, { color: COLORS.danger }]}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Sin notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.item, !item.read && styles.itemUnread]}>
              <Ionicons name={ICONS[item.type] as any} size={18} color={ICON_COLORS[item.type]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMessage}>{item.message}</Text>
                <Text style={styles.itemTime}>{timeAgo(item.timestamp)}</Text>
              </View>
              {!item.read && <View style={styles.dot} />}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textPrimary },
  actions: { flexDirection: 'row', gap: SPACING.md },
  action: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  itemUnread: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textPrimary },
  itemMessage: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  itemTime: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 4 },
});