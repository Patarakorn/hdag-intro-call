import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CompanySearchProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
  setInputValue?: (val: string) => void;
  inputValue?: string;
}

export const CompanySearch = ({ onSearch, isLoading, setInputValue, inputValue: propInputValue }: CompanySearchProps) => {
  const [inputValue, setLocalInputValue] = useState("");
  const value = propInputValue !== undefined ? propInputValue : inputValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSearch(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setInputValue) {
      setInputValue(e.target.value);
    } else {
      setLocalInputValue(e.target.value);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 z-10" />
          <Input
            type="text"
            placeholder="Enter company name (e.g., Apple, Microsoft, Tesla...)"
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="pl-10 py-4 text-lg bg-zinc-900/50 backdrop-blur-sm border-zinc-700 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-white placeholder-zinc-400"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center gap-2 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Research</span>
            </>
          )}
        </Button>
      </form>
      {/* Quick Examples */}
      <div className="mt-4 text-center">
        <p className="text-sm text-zinc-500 mb-2">Try searching for:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Apple", "Spotify", "Airbnb", "Netflix"].map((company) => (
            <button
              key={company}
              onClick={() => {
                if (!isLoading) {
                  onSearch(company);
                  setInputValue?.(company);
                }
              }}
              disabled={isLoading}
              className="text-sm bg-zinc-800/50 hover:bg-purple-900/30 hover:text-purple-300 text-zinc-300 px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-purple-600"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 