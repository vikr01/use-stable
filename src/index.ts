import { useRef } from "react";

const SENTINEL: unique symbol = Symbol();

export default function useStable<T>(
  creator: () => T,
  dependencies: Array<unknown>,
): T {
  const valueRef = useRef<typeof SENTINEL | T>(SENTINEL);
  const depsRef = useRef<Array<unknown>>(dependencies);

  if (
    valueRef.current === SENTINEL ||
    !isShallowEqual(depsRef.current, dependencies)
  ) {
    valueRef.current = creator();
  }

  depsRef.current = [...dependencies];

  return valueRef.current;
}

function isShallowEqual(arr1: Array<unknown>, arr2: Array<unknown>): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const length = arr1.length;

  for (let i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
