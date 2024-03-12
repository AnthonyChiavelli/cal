// import { renderHook } from "@testing-library/react-hooks";
// import { useOnMediaQueryMatch } from "../../src/util/hooks";

// describe("useOnMediaQueryMatch", () => {
//   it("should call the callback with the initial match value", () => {
//     const callback = jest.fn();
//     renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledWith(expect.any(Boolean));
//   });

//   it("should call the callback when the media query matches", () => {
//     const callback = jest.fn();
//     renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledTimes(1);

//     // Simulate a change in the media query match
//     window.matchMedia = jest.fn().mockImplementation(() => ({
//       matches: true,
//       addEventListener: jest.fn(),
//       removeEventListener: jest.fn(),
//     }));

//     renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledTimes(2);
//     expect(callback).toHaveBeenCalledWith(true);
//   });

//   it("should call the callback when the media query does not match", () => {
//     const callback = jest.fn();
//     renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledTimes(1);

//     // Simulate a change in the media query match
//     window.matchMedia = jest.fn().mockImplementation(() => ({
//       matches: false,
//       addEventListener: jest.fn(),
//       removeEventListener: jest.fn(),
//     }));

//     renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledTimes(2);
//     expect(callback).toHaveBeenCalledWith(false);
//   });

//   it("should remove the event listener when unmounted", () => {
//     const callback = jest.fn();
//     const { unmount } = renderHook(() => useOnMediaQueryMatch("768px", callback));
//     expect(callback).toHaveBeenCalledTimes(1);

//     unmount();
//     expect(callback).toHaveBeenCalledTimes(1); // The callback should not be called again after unmount
//   });
// });
