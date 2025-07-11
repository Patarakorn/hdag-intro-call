"use client";
import { useState } from "react";
import { TrendingUp, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalyticsPoint {
  header: string;
  description: string;
}

interface AnalyticsPointsProps {
  analyticsPoints: AnalyticsPoint[];
}

export const AnalyticsPointsCard = ({ analyticsPoints }: AnalyticsPointsProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

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
            <div key={index} className="bg-purple-900/20 rounded-lg border border-purple-800/30 overflow-hidden">
              <Button
                variant="ghost"
                className="w-full p-3 h-auto flex items-start gap-3 text-left hover:bg-purple-900/30 transition-colors"
                onClick={() => toggleExpanded(index)}
              >
                <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className={`text-sm font-medium text-zinc-200 leading-relaxed ${expandedItems.has(index) ? 'break-words whitespace-normal' : 'truncate whitespace-nowrap'}`}>
                    {point.header}
                  </span>
                </div>
                <div className="flex-shrink-0 ml-2 self-start">
                  {expandedItems.has(index) ? (
                    <ChevronUp className="h-4 w-4 text-purple-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-purple-400" />
                  )}
                </div>
              </Button>
              {expandedItems.has(index) && (
                <div className="px-3 pb-3">
                  <p className="text-sm text-zinc-300 leading-relaxed pl-7 break-words">
                    {point.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-500 text-center">
            💡 Click on opportunities to see detailed descriptions of what our club can build
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 