"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { FirebaseProvider } from "./FirebaseProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        {children}
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
