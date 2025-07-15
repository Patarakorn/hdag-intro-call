"use client";
import { useState, useEffect, useRef } from "react";
import { CompanySearch } from "@/components/CompanySearch";
import { CompanyResults } from "@/components/CompanyResults";
import { Building2, TrendingUp, Database, LogOut, MessageCircle, PhoneOutgoing, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/lib/api/auth";
import { useCompanySearch } from "@/lib/api/companies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { CompanyResultsData } from "@/components/CompanyResults";

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const logout = useLogout();
  const router = useRouter();
  const { data: me } = useMe();
  const toastRef = useRef<string | number | null>(null);
  const queryClient = useQueryClient();
  
  // Use the improved search hook
  const { data: searchResult, isLoading, error, search } = useCompanySearch(searchQuery);

  // Hydrate state from localStorage after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (me?.ok) {
        // Only restore last search if session is valid
        const lastSearch = localStorage.getItem("lastCompanySearch") || "";
        if (lastSearch) {
          setInputValue(lastSearch);
          setSearchQuery(lastSearch);
          search(lastSearch);
        }
      } else if (me?.ok === false) {
        // If session is invalid, clear all relevant storage and cache
        localStorage.removeItem("lastCompanySearch");
        localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
        queryClient.clear(); // <-- Make sure to clear React Query cache too!
      }
      // If me is undefined (loading), do nothing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.ok]);

  // Type the response properly to avoid explicit any
  const isAdmin = me?.ok && (me as { user: { email: string } })?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Handle search errors with toast notifications
  useEffect(() => {
    if (error) {
      console.error("Search error:", error);
      // Dismiss any existing loading toast
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }
      toast.error("Failed to fetch company data", {
        description: "Please try again later or check your internet connection.",
        duration: 5000,
      });
    }
  }, [error]);

  const handleSearch = (companyName: string) => {
    setSearchQuery(companyName);
    setInputValue(companyName);
    search(companyName);
    if (typeof window !== "undefined") {
      localStorage.setItem("lastCompanySearch", companyName);
    }
  };

  // Extract search results from the query response
  const searchResults = (searchResult && typeof searchResult === 'object' && 'ok' in searchResult && searchResult.ok && 'data' in searchResult)
    ? (searchResult as { ok: true; data: CompanyResultsData }).data
    : null;

  // Show success toast when search completes
  useEffect(() => {
    if (searchResults && searchQuery) {
      // Dismiss any existing loading toast
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }
      toast.success("Company data retrieved successfully", {
        duration: 3000,
      });
    }
  }, [searchResults, searchQuery]);

  // Show loading toast for long searches
  useEffect(() => {
    if (isLoading && searchQuery) {
      toastRef.current = toast.loading("Searching for company data...", {
        duration: Infinity, // Will be dismissed manually
      });
    }
  }, [isLoading, searchQuery]);

  // Dismiss loading toast when search completes
  useEffect(() => {
    if (!isLoading && searchQuery && toastRef.current) {
      toast.dismiss(toastRef.current);
      toastRef.current = null;
    }
  }, [isLoading, searchQuery]);

  const handleSignOut = async () => {
    try {
      // Clear state immediately to prevent any new API calls
      setSearchQuery(undefined);
      setInputValue(undefined);

      await logout.mutateAsync();

      // Clear localStorage and React Query cache BEFORE redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastCompanySearch");
        localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
      }
      queryClient.clear();

      // Use await to ensure navigation happens after clearing
      await router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed", {
        description: "Please try again.",
        duration: 3000,
      });
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
                onClick={() => router.push("/chat")}
                variant="outline"
                className="bg-purple-900/30 border-purple-600 text-purple-300 hover:bg-purple-700/40 hover:text-white hover:border-purple-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Questions
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => router.push("/admin")}
                  variant="outline"
                  className="bg-zinc-800/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/70 hover:text-white hover:border-zinc-400 transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
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
        <div className="grid grid-cols-1 gap-8">
          {/* Main Search Area */}
          <div className="lg:col-span-4">
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
              <CompanySearch onSearch={handleSearch} isLoading={isLoading} setInputValue={setInputValue} inputValue={inputValue ?? ""} />
            </div>
            {/* Results Section */}
            {(searchResults || isLoading) && (
              <CompanyResults 
                results={searchResults as CompanyResultsData | null} 
                isLoading={isLoading}
                searchQuery={searchQuery ?? ""}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 