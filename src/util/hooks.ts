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

/**
 * Executes a function when the provided breakpoint changes from matches to not matches or vice versa
 *
 * @param callback the function to execute. Will be called with true if the media query matches, false otherwise
 */
export function useOnMediaQueryMatch(width: string, callback: (matches: boolean) => void) {
  useEffect(() => {
    const mediaQueryList = window.matchMedia(`(max-width: ${width})`);
    const handleChange = () => {
      callback(mediaQueryList.matches);
    };
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
