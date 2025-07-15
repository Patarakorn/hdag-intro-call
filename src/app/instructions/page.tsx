import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";

const InstructionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950">
      {/* Header */}
      <header className="bg-black/50 border-b border-zinc-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">How to Use the HDAG Research Tool</h1>
                <p className="text-zinc-400">Instructions for users</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="outline" className="bg-zinc-800/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/70 hover:text-white hover:border-zinc-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
          <CardHeader className="rounded-t-lg border-b border-zinc-800 pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Info className="h-5 w-5 text-purple-400" />
              <span>Welcome to the HDAG Company Research Tool</span>
            </CardTitle>
            <p className="text-sm text-zinc-400">Follow these instructions to get the most out of your experience.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6 text-zinc-200">
            <section>
              <h2 className="text-lg font-semibold text-purple-300 mb-2">1. Login & Session Caching</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sign in to access company search and analytics features.</li>
                <li>After logging in, your search results and content are cached for <span className="font-semibold text-purple-200">one hour</span>.</li>
                <li>You can move between pages and refresh the site—your cached search results will persist for up to one hour after login.</li>
                <li>Logging out will immediately clear all cached content and search results.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-purple-300 mb-2">2. Company Search Tips</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To search, simply enter the <span className="font-semibold text-purple-200">company name</span> in the search bar.</li>
                <li>If multiple companies share the same name, you can specify the <span className="font-semibold text-purple-200">country</span> or <span className="font-semibold text-purple-200">industry</span> for more accurate results (e.g., &quot;Acme Corp, USA, Technology&quot;).</li>
                <li>Partial names and keywords are supported, but more details help improve search accuracy.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-purple-300 mb-2">3. What You Get After Searching</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><span className="font-semibold text-purple-200">Company Profile</span>: Name, industry, size, founding year, headquarters, description, revenue, and website.</li>
                <li><span className="font-semibold text-purple-200">Analytics Opportunities</span>: A list of tailored analytics project ideas and opportunities relevant to the company and its industry.</li>
                <li><span className="font-semibold text-purple-200">Past Case Studies</span>: If available, relevant case studies and project summaries from the HDAG database.</li>
                <li>All information is generated using advanced AI and curated data sources for accuracy and insight.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-purple-300 mb-2">4. Security & Privacy</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your session and search data are private and only accessible to you while logged in.</li>
                <li>Cached content is automatically deleted after one hour or upon logout.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-purple-300 mb-2">5. Need Help?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>If you have questions or encounter issues, please contact the HDAG team or your admin.</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstructionPage; 