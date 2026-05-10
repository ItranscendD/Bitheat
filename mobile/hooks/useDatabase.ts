import { useState, useEffect } from 'react';
import { initDB } from '@/services/db/database';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        setIsReady(true);
      } catch (e) {
        console.error('Database initialization failed:', e);
        setError(e as Error);
      }
    };

    setup();
  }, []);

  return { isReady, error };
};
