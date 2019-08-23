import { useEffect, useState, useCallback, useRef } from 'react';
export const usePreviousProps = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useInstance = <T>(instance: T) => {
  const instanceRef = useRef<T | null>(null);

  function getInstance(): T {
    if (instanceRef.current === null) {
      instanceRef.current = instance;
    }
    return instanceRef.current;
  }

  return getInstance();
};

export const useClientRect = () => {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
};
