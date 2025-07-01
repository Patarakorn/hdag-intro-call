import { Database, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PastCase {
  title: string;
  description: string;
  relevanceScore: number;
  year: string;
}

interface PastCasesProps {
  pastCases: PastCase[];
}

export const PastCasesCard = ({ pastCases }: PastCasesProps) => {
  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "bg-purple-900/50 text-purple-300 border-purple-700";
    if (score >= 80) return "bg-zinc-800/50 text-zinc-300 border-zinc-700";
    return "bg-zinc-800/30 text-zinc-400 border-zinc-600";
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300">
      <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
        <CardTitle className="flex items-center gap-2 text-white">
          <Database className="h-5 w-5 text-purple-400" />
          <span>Matching Past Cases</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-zinc-400 text-sm mb-4">
          Similar cases from our project history:
        </p>
        <div className="space-y-4">
          {pastCases.map((case_, index) => (
            <div key={index} className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white text-sm">{case_.title}</h4>
                <Badge className={`text-xs ${getRelevanceColor(case_.relevanceScore)}`}>
                  <Star className="h-3 w-3 mr-1" />
                  {case_.relevanceScore}%
                </Badge>
              </div>
              <p className="text-zinc-300 text-sm mb-3 leading-relaxed">{case_.description}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="h-3 w-3" />
                <span>{case_.year}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-500 text-center">
            📊 Relevance scores based on industry, company size, and project complexity
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 