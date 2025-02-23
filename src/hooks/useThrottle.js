import { useRef, useCallback, useEffect } from "react"; // ✅ Added useEffect

export default function useThrottle(callback, delay) {
  const lastCall = useRef(0);
  const savedCallback = useRef(callback);

  // ✅ Ensure the latest callback reference is always used
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current < delay) return;
      lastCall.current = now;
      savedCallback.current(...args);
    },
    [delay] // ✅ Removed callback from dependencies to ensure stability
  );
}
