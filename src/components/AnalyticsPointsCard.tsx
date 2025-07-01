import { TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsPointsProps {
  analyticsPoints: string[];
}

export const AnalyticsPointsCard = ({ analyticsPoints }: AnalyticsPointsProps) => {
  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300">
      <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <span>Analytics Opportunities</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-zinc-400 text-sm mb-4">
          Key data analytics opportunities identified for this company:
        </p>
        <div className="space-y-3">
          {analyticsPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
              <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-zinc-300 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-500 text-center">
            💡 These opportunities align with our club&apos;s expertise in data analysis and modeling
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 