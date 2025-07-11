import { Skeleton } from "@/components/ui/skeleton";
import { CompanyInfoCard } from "@/components/CompanyInfoCard";
import { AnalyticsPointsCard } from "@/components/AnalyticsPointsCard";
import { PastCasesCard } from "@/components/PastCasesCard";

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

interface PastCase {
  title: string;
  description: string;
  relevanceScore: number;
  year: string;
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

// Mock past cases data - this can be replaced with real API calls later
const getMockPastCases = (industry: string): PastCase[] => {
  const baseCases = [
    {
      title: "Customer Segmentation Analysis",
      description: "Analyzed customer behavior patterns for business optimization and targeted marketing strategies.",
      relevanceScore: 85,
      year: "2023"
    },
    {
      title: "Predictive Analytics Implementation",
      description: "Developed forecasting models for strategic planning and resource allocation.",
      relevanceScore: 80,
      year: "2023"
    },
    {
      title: "Performance Optimization Study",
      description: "Identified efficiency improvements through comprehensive data analysis and process optimization.",
      relevanceScore: 75,
      year: "2022"
    }
  ];

  // Add industry-specific cases
  const industryCases: Record<string, PastCase[]> = {
    'Technology': [
      {
        title: "User Behavior Analytics Dashboard",
        description: "Built comprehensive user analytics platform for SaaS company to track engagement and retention.",
        relevanceScore: 92,
        year: "2023"
      },
      {
        title: "Churn Prediction Model",
        description: "Developed machine learning model to predict customer churn for subscription-based tech company.",
        relevanceScore: 88,
        year: "2023"
      }
    ],
    'Finance': [
      {
        title: "Risk Assessment Model",
        description: "Created credit risk evaluation system for financial institution using machine learning.",
        relevanceScore: 90,
        year: "2023"
      },
      {
        title: "Fraud Detection System",
        description: "Implemented real-time fraud detection using anomaly detection algorithms.",
        relevanceScore: 87,
        year: "2022"
      }
    ],
    'Healthcare': [
      {
        title: "Patient Outcome Prediction",
        description: "Developed predictive model for patient outcomes based on treatment protocols and demographics.",
        relevanceScore: 89,
        year: "2023"
      },
      {
        title: "Resource Utilization Analysis",
        description: "Optimized hospital resource allocation through data-driven analysis of bed and staff utilization.",
        relevanceScore: 84,
        year: "2022"
      }
    ],
    'Retail': [
      {
        title: "Inventory Optimization System",
        description: "Built demand forecasting model for retail chain to optimize inventory levels and reduce waste.",
        relevanceScore: 86,
        year: "2023"
      },
      {
        title: "Customer Lifetime Value Analysis",
        description: "Analyzed customer purchase patterns to identify high-value customers and retention strategies.",
        relevanceScore: 82,
        year: "2022"
      }
    ],
    'Manufacturing': [
      {
        title: "Predictive Maintenance System",
        description: "Implemented IoT-based predictive maintenance for manufacturing equipment to reduce downtime.",
        relevanceScore: 91,
        year: "2023"
      },
      {
        title: "Quality Control Analytics",
        description: "Developed quality monitoring system using computer vision and statistical analysis.",
        relevanceScore: 85,
        year: "2022"
      }
    ]
  };

  // Combine base cases with industry-specific cases
  const industrySpecificCases = industryCases[industry] || [];
  return [...baseCases, ...industrySpecificCases].slice(0, 5); // Return top 5 most relevant
};

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

  // Get mock past cases based on company industry
  const mockPastCases = getMockPastCases(results.companyInfo.industry);

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
        <PastCasesCard pastCases={mockPastCases} />
      </div>
    </div>
  );
}; 