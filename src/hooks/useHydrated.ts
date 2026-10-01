import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False while the server renders and the client hydrates, true once the
 * client is running. The usual `useEffect(() => setMounted(true))` does the
 * same with an extra render that the React Compiler's lint rejects.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
