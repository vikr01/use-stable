# use-stable

React hook meant to create a stable value that *only clears when the dependencies change*.

This is different from `useMemo`, which is a *memoized* value, that can be recreated even when dependencies don't change:

> [However, since `useMemo` is performance optimization, not a semantic guarantee, React may throw away the cached value if there is a specific reason to do that.](https://react.dev/reference/react/useMemo#my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined:~:text=However%2C%20since%20useMemo%20is%20performance%20optimization%2C%20not%20a%20semantic%20guarantee%2C%20React%20may%20throw%20away%20the%20cached%20value%20if%20there%20is%20a%20specific%20reason%20to%20do%20that.)

> 

This hook is meant for cases that are not pure, usually when the return is a pointer that is *meaningful* -- for `WeakMap`, `WeakSet`, and other *associative* data structures.

API is the same as `useMemo`.

```js
import useStable from 'use-stable'

function useMyCustomHook(socket) {
    const socket = useStable(()=>new WebSocket(`wss://example.com/${socket}`), [socket]);

    // use socket as a prop for other components/hooks
}
```
