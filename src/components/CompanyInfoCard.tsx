import { Building2, MapPin, Calendar, Users, DollarSign, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyInfoProps {
  companyInfo: {
    name: string;
    industry: string;
    size: string;
    founded: string;
    headquarters: string;
    description: string;
    revenue: string;
    website: string;
  };
}

export const CompanyInfoCard = ({ companyInfo }: CompanyInfoProps) => {
  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300">
      <CardHeader className="rounded-t-xl border-b border-zinc-800 pt-0 bg-transparent">
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5 text-purple-400" />
          <span>Company Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{companyInfo.name}</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">{companyInfo.description}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">Industry:</span>
            <span className="font-medium text-white">{companyInfo.industry}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">Size:</span>
            <span className="font-medium text-white">{companyInfo.size}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">Founded:</span>
            <span className="font-medium text-white">{companyInfo.founded}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">HQ:</span>
            <span className="font-medium text-white">{companyInfo.headquarters}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">Revenue:</span>
            <span className="font-medium text-white">{companyInfo.revenue}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-400">Website:</span>
            <a href={`https://${companyInfo.website}`} target="_blank" rel="noopener noreferrer"
               className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              {companyInfo.website}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 