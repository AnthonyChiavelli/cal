import { useRef, useEffect, useState } from "react";

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

/**
 * Returns a boolean state value that is true if the media query matches, false otherwise
 *
 * @param callback state this is set to true if the screen is < than the provided breakpoint, false otherwise
 */
export function useOnMediaQueryState(width: string) {
  const [isMatching, setIsMatching] = useState(false);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(`(max-width: ${width})`);
    const handleChange = () => {
      setIsMatching(mediaQueryList.matches);
    };
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return isMatching;
}
