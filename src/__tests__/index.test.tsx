import * as React from "react";
import { useImperativeHandle } from "react";
import { cleanup, render } from "@testing-library/react";
import useStable from "../";

describe("useStable", () => {
  afterEach(() => {
    cleanup();
  });

  it("can successfully create the value", () => {
    const val = 500;

    const [result] = renderHook(() => val, [0]);

    expect(result).toBe(val);
  });

  it("won't recreate the value if the deps don't change", () => {
    const val = 300;
    const createVal = jest.fn(() => val);
    const deps = [0, 1, 2, 3, 4];
    const deps2 = [...deps];

    const [result, rerender] = renderHook(createVal, deps);

    expect(result).toBe(val);

    expect(createVal).toHaveBeenCalledTimes(1);

    createVal.mockClear();

    const result2 = rerender(createVal, deps2);

    expect(result2).toBe(val);
    expect(createVal).not.toHaveBeenCalled();
  });

  it("will recreate the value if the deps change even if pointer is the same", () => {
    let i = 0;
    const results = [400, 800];
    const createVal = jest.fn(() => results[i++]);
    const deps = [0, 1, 2, 3, 4];

    const [result, rerender] = renderHook(createVal, deps);

    expect(result).toBe(results[0]);

    expect(createVal).toHaveBeenCalledTimes(1);
    createVal.mockClear();

    deps[2] *= -1;

    const result2 = rerender(createVal, deps);

    expect(result2).toBe(results[1]);
    expect(createVal).toHaveBeenCalledTimes(1);
  });
});

function renderHook<T>(
  _cb: () => T,
  _deps: Array<unknown>,
): [T, (_cb: () => T, _deps: Array<unknown>) => T] {
  const valueRef: React.RefObject<null | T> = { current: null };

  const makeElement = (cb: () => T, deps: Array<unknown>) => (
    <TestingComponent cb={cb} deps={deps} valueRef={valueRef} />
  );

  const { rerender: _rerender } = render(makeElement(_cb, _deps));

  const rerender = (cb: () => T, deps: Array<unknown>): T => {
    _rerender(makeElement(cb, deps));

    return valueRef.current as T;
  };

  return [valueRef.current as T, rerender];
}

function TestingComponent<T>({
  cb,
  deps,
  valueRef,
}: {
  cb: () => T;
  deps: Array<unknown>;
  valueRef: React.Ref<T>;
}): null {
  const value = useStable(cb, deps);
  useImperativeHandle(valueRef, () => value);

  return null;
}
