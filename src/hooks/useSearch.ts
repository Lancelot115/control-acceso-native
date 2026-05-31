import { useMemo, useState } from 'react';

export function useSearch<T>(items: T[], searchKeys: (keyof T)[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      searchKeys.some(key => {
        const val = item[key];
        return typeof val === 'string' && val.toLowerCase().includes(q);
      })
    );
  }, [items, query, searchKeys]);

  return { query, setQuery, filtered };
}