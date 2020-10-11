import { DependencyList, useEffect, useState } from 'react';

/**
 * @param interval milliseconds
 */
export function useTimeStamp(interval: number) {
  const [timeStamp, setTimeStamp] = useState(Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeStamp(Date.now());
    }, interval);

    return () => clearTimeout(timerId);
  }, []);

  return timeStamp;
}

export function useApi<T>(api: string, initialState: T, deps?: DependencyList) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(`/api/${api}`).then((res) => res.json());
        setState(data);
      } catch (error) {
        console.error(error.stack);
      }
    })();
  }, deps);

  return state;
}
