import { useState, useEffect } from "react";

/**
 * Reads from localStorage by key and parses the JSON string (if any).
 */
function getItem<T>(key: string): T | null {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return null;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.warn("usePersistedState: Error parsing localStorage item", error);
    return null;
  }
}


function setItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("usePersistedState: Error setting localStorage item", error);
  }
}

/**
 * A custom hook that syncs state with localStorage under the given key.
 * @param key The localStorage key to read/write.
 * @param initialValue 
 */
export function usePersistedState<T>(key: string, initialValue: T) {
  // On initial render, check localStorage for an existing value
  const [value, setValue] = useState<T>(() => {
    const stored = getItem<T>(key);
    return stored !== null ? stored : initialValue;
  });

  // Whenever `value` changes, store it in localStorage
  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
