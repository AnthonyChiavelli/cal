"use client";

import MoonLoader from "react-spinners/MoonLoader";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <MoonLoader loading />
    </div>
  );
}
