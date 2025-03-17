import { useState, useEffect, useRef } from "react";

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
export function usePersistedState<T>(key, initialValue, delay = 1000) {
  // Get the initial state from local storage if it exists.
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  // A ref to hold our debounce timer
  const timer = useRef(null);

  useEffect(() => {
    // Clear any existing timer when state changes
    if (timer.current) {
      clearTimeout(timer.current);
    }

    // Set a new timer to update local storage after the specified delay
    timer.current = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, delay);

    // Clear the timer on unmount or if key/state changes before delay is reached
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [key, state, delay]);

  return [state, setState];
}
