import { useMemo, useState } from 'react';
import { AccessRecordWithStudent } from '../types';

export type FilterType = 'all' | 'entry' | 'exit' | 'denied';

export function useFilter(records: AccessRecordWithStudent[]) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'entry': return records.filter(r => r.type === 'entry' && r.authorized);
      case 'exit': return records.filter(r => r.type === 'exit');
      case 'denied': return records.filter(r => !r.authorized);
      default: return records;
    }
  }, [records, filter]);

  return { filter, setFilter, filtered };
}