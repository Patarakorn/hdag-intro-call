import { Skeleton } from "@/components/ui/skeleton";
import { CompanyInfoCard } from "@/components/CompanyInfoCard";
import { AnalyticsPointsCard } from "@/components/AnalyticsPointsCard";
import { SimilarCasesCard } from "@/components/SimilarCasesCard";

interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  founded: string;
  headquarters: string;
  description: string;
  revenue: string;
  website: string;
}

interface AnalyticsPoint {
  header: string;
  description: string;
}

export interface CompanyResultsData {
  companyInfo: CompanyInfo;
  analyticsPoints: AnalyticsPoint[];
}

interface CompanyResultsProps {
  results: CompanyResultsData | null;
  isLoading: boolean;
  searchQuery: string;
}

export const CompanyResults = ({ results, isLoading, searchQuery }: CompanyResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  // Create optimized company info string for similarity search
  const companyInfoString = `${results.companyInfo.name} - ${results.companyInfo.industry} industry, ${results.companyInfo.size} company founded in ${results.companyInfo.founded}, headquartered in ${results.companyInfo.headquarters}. ${results.companyInfo.description}`;

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Research Results for &quot;{searchQuery}&quot;
        </h3>
        <p className="text-zinc-400">
          Comprehensive insights and analytics opportunities identified
        </p>
      </div>
      {/* Results Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <CompanyInfoCard companyInfo={results.companyInfo} />
        <AnalyticsPointsCard analyticsPoints={results.analyticsPoints} />
        <SimilarCasesCard companyInfo={companyInfoString} />
      </div>
    </div>
  );
}; 