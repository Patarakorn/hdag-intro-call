"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const RAGChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I can help you explore our company research and past cases. Ask me anything about analytics opportunities, similar projects, or company insights!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateRAGResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('case') || lowerQuery.includes('project') || lowerQuery.includes('similar')) {
      return "Based on our case database, I found several relevant projects:\n\n• **Customer Segmentation Analysis (2023)** - 95% relevance for tech companies\n• **Sales Attribution Modeling (2023)** - Great for B2B SaaS businesses\n• **Churn Prediction Model (2022)** - Perfect for subscription models\n\nWould you like me to elaborate on any specific case?";
    }
    
    if (lowerQuery.includes('analytics') || lowerQuery.includes('opportunity') || lowerQuery.includes('data')) {
      return "Here are key analytics opportunities I've identified:\n\n🔍 **Customer Segmentation** - Large datasets perfect for behavioral analysis\n📊 **Attribution Modeling** - Multi-channel sales data available\n🌐 **Web Analytics** - Strong digital presence creates rich data streams\n🌍 **Cross-market Analysis** - International operations provide comparison opportunities\n📈 **Cohort Analysis** - Subscription models ideal for retention studies";
    }
    
    if (lowerQuery.includes('company') || lowerQuery.includes('business') || lowerQuery.includes('industry')) {
      return "I can provide detailed company insights based on our research database. Key areas I can help with:\n\n• **Industry Analysis** - Technology, retail, finance sectors\n• **Company Profiles** - Size, revenue, market position\n• **Business Models** - Subscription, B2B, e-commerce patterns\n\nSearch for a specific company on the main page first, then I can provide more targeted insights!";
    }
    
    if (lowerQuery.includes('tech') || lowerQuery.includes('technology')) {
      return "Technology companies typically excel in analytics due to:\n\n✅ **Rich Data Sources** - User interactions, product usage, sales funnels\n✅ **Digital Infrastructure** - APIs, databases, tracking systems\n✅ **Scalable Models** - Large user bases for statistical significance\n✅ **Innovation Culture** - Openness to data-driven decision making\n\nOur club has completed 15+ tech company projects with 90%+ client satisfaction!";
    }
    
    return "That's an interesting question! I can help you with:\n\n• **Past Case Studies** - Browse our project history and success stories\n• **Analytics Opportunities** - Identify data potential for any company\n• **Company Insights** - Get detailed business intelligence\n• **Project Matching** - Find similar cases to your interests\n\nWhat would you like to explore?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: simulateRAGResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Show me similar tech cases",
    "What analytics opportunities exist?",
    "Tell me about past projects",
    "How do you evaluate companies?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950">
      {/* Header */}
      <header className="bg-black/50 border-b border-zinc-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Research Assistant</h1>
                <p className="text-zinc-400">Ask questions about our cases and insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="outline" className="bg-zinc-800/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/70 hover:text-white hover:border-zinc-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>
        <Card className="h-[calc(100vh-220px)] bg-zinc-900/50 backdrop-blur-sm border-zinc-800 flex flex-col">
          <CardHeader className="rounded-t-lg border-b border-zinc-800 pb-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Chat with Research Assistant</span>
            </CardTitle>
            <p className="text-sm text-zinc-400">Explore our company database and past analytics projects</p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse gap-x-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-purple-600' 
                        : 'bg-zinc-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-purple-300" />
                      )}
                    </div>
                    <div className={`rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-purple-300" />
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-6 border-t border-zinc-800 flex-shrink-0">
                <p className="text-sm text-zinc-500 mb-3">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-left text-sm bg-zinc-800/50 hover:bg-purple-900/30 text-zinc-400 hover:text-purple-300 px-3 py-2 rounded transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-zinc-800 flex-shrink-0">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cases, companies, analytics opportunities..."
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RAGChatPage; 