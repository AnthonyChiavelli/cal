"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { useOnMount } from "@/util/hooks";
import clientSetup from "./app/client-setup";

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
