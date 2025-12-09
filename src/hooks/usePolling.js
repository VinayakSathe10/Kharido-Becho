// src/hooks/usePolling.js
import { useEffect, useRef } from 'react';

export function usePolling(fn, interval = 5000) {
  const savedFn = useRef();

  useEffect(() => {
    savedFn.current = fn;
  }, [fn]);

  useEffect(() => {
    function tick() {
      savedFn.current();
    }
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
}
