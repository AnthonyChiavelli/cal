"use client";

import LoadingPane from "@/app/components/loading_pane";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingPane />
    </div>
  );
}
