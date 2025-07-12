import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";

type SimilarCasesRes = InferResponseType<typeof client.api.cases.similar.$post>;

// POST /api/cases/similar
export function useSimilarCases(companyInfo: string | null, limit: number = 5) {
  return useQuery<SimilarCasesRes>({
    queryKey: ["similar-cases", companyInfo, limit],
    queryFn: async () => {
      if (!companyInfo) {
        return { ok: false } as SimilarCasesRes;
      }
      
      console.log(`🔍 Finding similar cases for company info: ${companyInfo.substring(0, 100)}...`);
      
      const response = await client.api.cases.similar.$post({
        json: { 
          companyInfo,
          limit
        }
      });
      
      if (!response.ok) {
        return { ok: false } as SimilarCasesRes;
      }
      
      const data = await response.json();
      return data as SimilarCasesRes;
    },
    enabled: !!companyInfo,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
} 