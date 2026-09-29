import { useEffect, useState } from 'react';

export type PiResponse = {
  pi: string;
  decimals: number;
  updatedAt: string;
};

export function usePi() {
  const [data, setData] = useState<PiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/pi');
        if (!res.ok) throw new Error(`server returned ${res.status}`);
        setData(await res.json());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'something went wrong');
      }
    }

    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  return { data, error };
}
