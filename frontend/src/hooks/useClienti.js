import { useState, useEffect } from 'react';
import { clientiApi } from '../api/clienti';

export function useClienti() {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clientiApi
      .getAll()
      .then(setClienti)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { clienti, loading, error };
}
