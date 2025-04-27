import { type useRef as useRefType } from "react";

const SENTINEL: unique symbol = Symbol();

type Creator<T> = () => T;
type Dependencies = ReadonlyArray<unknown>;

export type UseStable = <T>(
  creator: Creator<T>,
  dependencies: Dependencies,
) => T;

export default function builder(useRef: typeof useRefType): UseStable {
  return function useStable<T>(
    creator: Creator<T>,
    dependencies: Dependencies,
  ): T {
    const valueRef = useRef<typeof SENTINEL | T>(SENTINEL);
    const depsRef = useRef<null | Dependencies>(null);

    const prevDeps = depsRef.current ?? [];

    if (
      valueRef.current === SENTINEL ||
      !isShallowEqual(prevDeps, dependencies)
    ) {
      valueRef.current = creator();
      depsRef.current = [...dependencies];
    }

    return valueRef.current;
  };

  function isShallowEqual(arr1: Dependencies, arr2: Dependencies): boolean {
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
}
