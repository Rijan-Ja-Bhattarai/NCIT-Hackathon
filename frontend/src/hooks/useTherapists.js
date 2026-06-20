import { useState, useEffect } from 'react';
import { therapistsApi } from '../services/api';

export function useTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    therapistsApi
      .list()
      .then((data) => {
        if (!cancelled) setTherapists(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { therapists, loading, error };
}
