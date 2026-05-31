import { useCallback, useEffect, useState } from 'react';
import { accessService } from '../services/accessService';
import { AccessRecordWithStudent, Stats } from '../types';

export function useAccessData() {
  const [records, setRecords] = useState<AccessRecordWithStudent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [recs, st] = await Promise.all([
        accessService.getRecords(),
        accessService.getStats(),
      ]);
      setRecords(recs);
      setStats(st);
    } catch (e) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { records, stats, loading, error, refetch: fetchData };
}