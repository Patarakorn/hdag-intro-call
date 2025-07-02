"use client";
import { useState } from "react";
import { CompanySearch } from "@/components/CompanySearch";
import { CompanyResults } from "@/components/CompanyResults";
import { Building2, TrendingUp, Database, LogOut, MessageCircle, PhoneOutgoing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

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

interface PastCase {
  title: string;
  description: string;
  relevanceScore: number;
  year: string;
}

interface CompanyResultsData {
  companyInfo: CompanyInfo;
  analyticsPoints: string[];
  pastCases: PastCase[];
}

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanyResultsData | null>(null);
  const [showRAGChat, setShowRAGChat] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  const handleSearch = async (companyName: string) => {
    setIsLoading(true);
    setSearchQuery(companyName);
    // Simulate API call - replace with your actual API integration
    setTimeout(() => {
      setSearchResults({
        companyInfo: {
          name: companyName,
          industry: "Technology",
          size: "1,001-5,000 employees",
          founded: "2008",
          headquarters: "San Francisco, CA",
          description: "A leading technology company focused on innovative solutions and digital transformation.",
          revenue: "$2.1B (2023)",
          website: "www.example.com"
        },
        analyticsPoints: [
          "Large customer dataset suitable for segmentation analysis",
          "Multi-channel sales data perfect for attribution modeling",
          "Strong digital presence with rich web analytics opportunities",
          "International operations providing cross-market comparison potential",
          "Subscription-based model ideal for cohort and churn analysis"
        ],
        pastCases: [
          {
            title: "Customer Segmentation Analysis",
            description: "Analyzed customer behavior patterns for a similar tech company",
            relevanceScore: 95,
            year: "2023"
          },
          {
            title: "Sales Attribution Modeling",
            description: "Multi-touch attribution analysis for B2B SaaS company",
            relevanceScore: 88,
            year: "2023"
          },
          {
            title: "Churn Prediction Model",
            description: "Predictive analytics for subscription-based business model",
            relevanceScore: 82,
            year: "2022"
          }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSignOut = async () => {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950">
      {/* Header */}
      <header className="bg-black/60 border-b border-zinc-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <PhoneOutgoing className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HDAG Intro Call</h1>
                <p className="text-zinc-400">Harvard Undergraduate Data Analytics Club Research Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowRAGChat(!showRAGChat)}
                variant="outline"
                className="bg-purple-900/30 border-purple-600 text-purple-300 hover:bg-purple-700/40 hover:text-white hover:border-purple-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {showRAGChat ? "Hide Chat" : "Ask Questions"}
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-zinc-800/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/70 hover:text-white hover:border-zinc-400 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Search Area */}
          <div className={`${showRAGChat ? "lg:col-span-3" : "lg:col-span-4"}`}>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Discover Company Insights
              </h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
                Get comprehensive company information, identify data analytics opportunities, 
                and find relevant case studies from our past projects.
              </p>
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-zinc-700">
                  <Building2 className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-zinc-300">Company Intelligence</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-zinc-700">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-zinc-300">Analytics Opportunities</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-zinc-700">
                  <Database className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-zinc-300">Case Study Matching</span>
                </div>
              </div>
            </div>
            {/* Search Section */}
            <div className="mb-8">
              <CompanySearch onSearch={handleSearch} isLoading={isLoading} />
            </div>
            {/* Results Section */}
            {(searchResults || isLoading) && (
              <CompanyResults 
                results={searchResults} 
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            )}
          </div>
          {/* RAG Chat Sidebar Placeholder */}
          {showRAGChat && (
            <div className="lg:col-span-1 flex flex-col">
              {/* <RAGChat searchResults={searchResults} /> */}
              <div className="bg-zinc-900/80 rounded-xl p-6 text-zinc-400 border border-zinc-800 flex-1 flex items-center justify-center">
                <span>RAGChat coming soon…</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 