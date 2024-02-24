import { useRef, useEffect } from "react";

/**
 * Executes a function only once when the component mounts
 *
 * @param callback the function to execute
 */
export function useOnMount(callback: () => void) {
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
