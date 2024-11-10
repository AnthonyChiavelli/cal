"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import clientSetup from "@/app/app/client-setup";
import { useOnMount } from "@/util/hooks";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  useOnMount(() => {
    clientSetup();
  });
  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
