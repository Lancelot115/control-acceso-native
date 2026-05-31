import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from './constants';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="compass-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.title}>Página no encontrada</Text>
      <Text style={styles.sub}>La ruta que buscas no existe</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('../(app)')}>
        <Text style={styles.btnText}>Ir al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.background },
  title: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  btnText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white },
});