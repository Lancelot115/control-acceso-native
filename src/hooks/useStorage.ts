import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    storageService.get<T>(key).then(v => {
      if (v !== null) setValue(v);
    });
  }, [key]);

  const set = async (newValue: T) => {
    setValue(newValue);
    await storageService.set(key, newValue);
  };

  return [value, set] as const;
}