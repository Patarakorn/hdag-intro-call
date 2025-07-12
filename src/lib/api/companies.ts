import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { useState, useCallback, useEffect } from "react";

type SearchCompanyRes = InferResponseType<typeof client.api.companies.search.$get>;

// GET /api/companies/search?q=companyName
export function useSearchCompany(companyName: string | null) {
  return useQuery<SearchCompanyRes>({
    queryKey: ["company-search", companyName],
    queryFn: async () => {
      if (!companyName) {
        return { ok: false } as SearchCompanyRes;
      }
      
      const response = await client.api.companies.search.$get({
        query: { q: companyName }
      });
      if (!response.ok) {
        return { ok: false } as SearchCompanyRes;
      }
      const data = await response.json();
      return data as SearchCompanyRes;
    },
    enabled: !!companyName,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Allow refetch on mount to show cached data
    refetchOnReconnect: false, // Don't refetch on network reconnect
  });
}

// Custom hook to prevent duplicate searches
export function useCompanySearch(initialSearchTerm?: string) {
  const [searchTerm, setSearchTerm] = useState<string | null>(initialSearchTerm ?? null);
  const [lastSearched, setLastSearched] = useState<string | null>(initialSearchTerm ?? null);
  
  const query = useSearchCompany(searchTerm);
  
  const search = useCallback((companyName: string) => {
    const trimmedName = companyName.trim();
    if (!trimmedName) {
      return;
    }
    
    // Prevent duplicate searches
    if (trimmedName === lastSearched) {
      return;
    }
    
    setLastSearched(trimmedName);
    setSearchTerm(trimmedName);
  }, [lastSearched]);
  
  return {
    ...query,
    search,
    searchTerm,
    lastSearched,
    isLoading: query.isLoading || query.isFetching
  };
} 