// src/components/Providers.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  persistQueryClient,
} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Allow refetch on mount to show cached data
        refetchOnReconnect: false,
        retry: false,
      },
    },
  }));

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const localStoragePersister = createAsyncStoragePersister({
        storage: window.localStorage,
      });
      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
        maxAge: 60 * 60 * 1000, // 1 hour
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
