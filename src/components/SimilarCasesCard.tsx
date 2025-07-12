import { Database, Star, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimilarCases } from "@/lib/api/cases";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface SimilarCasesCardProps {
  companyInfo: string | null;
}

interface SimilarCase {
  id: string;
  filename: string;
  extractedText: string;
  similarity: number;
}

export const SimilarCasesCard = ({ companyInfo }: SimilarCasesCardProps) => {
  const { data, isLoading, error } = useSimilarCases(companyInfo, 5);
  const [selectedCase, setSelectedCase] = useState<SimilarCase | null>(null);

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "bg-green-900/50 text-green-300 border-green-700";
    if (score >= 0.6) return "bg-blue-900/50 text-blue-300 border-blue-700";
    if (score >= 0.4) return "bg-yellow-900/50 text-yellow-300 border-yellow-700";
    return "bg-zinc-800/50 text-zinc-300 border-zinc-700";
  };

  const handleCaseClick = (case_: SimilarCase) => {
    setSelectedCase(case_);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  if (!companyInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
        <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-purple-400" />
            <span>Similar Past Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-zinc-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-4 w-32 bg-zinc-700" />
                  <Skeleton className="h-5 w-16 bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.ok) {
    return (
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
        <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-purple-400" />
            <span>Similar Past Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-zinc-400 text-sm">
              Unable to load similar cases at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const similarCases = (data as { ok: true; data: SimilarCase[] }).data;

  if (similarCases.length === 0) {
    return (
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
        <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-purple-400" />
            <span>Similar Past Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-zinc-400 text-sm">
              No similar cases found in our database.
            </p>
            <p className="text-zinc-500 text-xs mt-2">
              This could be a unique opportunity for a new type of project!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300">
        <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-purple-400" />
            <span>Similar Past Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-zinc-400 text-sm mb-4">
            Cases with similar characteristics from our project history:
          </p>
          <div className="space-y-3">
            {similarCases.map((case_) => (
              <div 
                key={case_.id} 
                className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                onClick={() => handleCaseClick(case_)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    <h4 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                      {case_.filename}
                    </h4>
                    <ExternalLink className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <Badge className={`text-xs ${getSimilarityColor(case_.similarity)}`}>
                    <Star className="h-3 w-3 mr-1" />
                    {(case_.similarity * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-500 text-center">
              📊 Similarity scores based on vector embeddings and semantic analysis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">{selectedCase.filename}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`text-sm ${getSimilarityColor(selectedCase.similarity)}`}>
                  <Star className="h-3 w-3 mr-1" />
                  {(selectedCase.similarity * 100).toFixed(0)}% Similar
                </Badge>
                <button
                  onClick={handleCloseModal}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedCase.extractedText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 