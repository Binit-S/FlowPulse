"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, PropsWithChildren } from "react";
import { FirebaseProvider } from "./FirebaseProvider";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        {children}
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
