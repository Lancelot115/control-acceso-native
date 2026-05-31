import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AccessCard } from '../components/Accesscard';
import { FilterButton } from '../components/Filterbutton';
import { LoadingSpinner } from '../components/Loadingspinner';
import { SearchBar } from '../components/Searchbar';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { useAccessData } from '../hooks/useAccessData';
import { useFilter } from '../hooks/useFilter';
import { useSearch } from '../hooks/useSearch';

export default function HistoryScreen() {
  const { records, loading, error, refetch } = useAccessData();

  const { filter, setFilter, filtered: byFilter } = useFilter(records);
  const { query, setQuery, filtered } = useSearch(byFilter, ['gate'] as any);

  // Búsqueda también por nombre del estudiante
  const finalFiltered = query
    ? byFilter.filter(r =>
        r.student.name.toLowerCase().includes(query.toLowerCase()) ||
        r.student.id.toLowerCase().includes(query.toLowerCase()) ||
        r.gate.toLowerCase().includes(query.toLowerCase())
      )
    : byFilter;

  if (loading) return <LoadingSpinner message="Cargando historial..." />;

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nombre, ID, puerta..." />
        <View style={{ height: SPACING.sm }} />
        <FilterButton active={filter} onChange={setFilter} />
        <Text style={styles.count}>{finalFiltered.length} registro{finalFiltered.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={finalFiltered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AccessCard record={item} onPress={() => router.push(`../(app)/${item.studentId}`)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Sin resultados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  top: { backgroundColor: COLORS.surface, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  count: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 4 },
  list: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted },
});