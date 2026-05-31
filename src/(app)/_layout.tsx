import { Ionicons } from '@expo/vector-icons';
import { Redirect, usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';

const DRAWER_ITEMS = [
  { name: '/(app)', label: 'Dashboard', icon: 'grid-outline' },
  { name: '/(app)/history', label: 'Historial', icon: 'time-outline' },
  { name: '/(app)/settings', label: 'Configuración', icon: 'settings-outline' },
] as const;

function CustomDrawerContent() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={COLORS.white} />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : 'Guardia'}</Text>
      </View>

      {/* Nav items */}
      <ScrollView style={{ flex: 1 }}>
        {DRAWER_ITEMS.map(item => {
          const isActive = pathname === item.name || (item.name === '/(app)' && pathname === '/');
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => router.push(item.name as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect href="../(auth)/login" />;

  return (
    <Drawer
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="history" options={{ title: 'Historial' }} />
      <Drawer.Screen name="settings" options={{ title: 'Configuración' }} />
      <Drawer.Screen name="[id]" options={{ title: 'Detalle', drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + SPACING.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  userName: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white },
  userRole: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md + 2,
    marginHorizontal: SPACING.sm, marginVertical: 2,
    borderRadius: RADIUS.md,
  },
  navItemActive: { backgroundColor: COLORS.primaryLight },
  navLabel: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  drawerFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  logoutText: { fontSize: FONT_SIZE.md, color: COLORS.danger, fontWeight: '600' },
});