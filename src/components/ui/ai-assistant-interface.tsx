import React, { useState, useRef } from "react";
import { askGemini } from "@/api/ask";

"use client";
import WelcomeBanner from "@/components/ui/WelcomeBanner";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Download, motion, AnimatePresence already imported below

import {
  Search,
  Mic,
  ArrowUp,
  Plus,
  FileText,
  TrendingUp,
  PiggyBank,
  CreditCard,
  BrainCircuit,
  Sparkles,
  Loader2,
  Download,
  Upload,
} from "lucide-react";
// Already imported above
import { useMCP } from '../../contexts/MCPContext';
import { loadMCPFromFile } from '../../utils/loadMCP';
// Import generateInsightReport and InsightReportModal (already in this file)

// InsightRow type for financial insights
export type InsightRow = {
  section: string; // e.g., "SummaryCard", "SpendingChart", "GoalCard"
  metric: string;  // e.g., "Net Worth", "Food & Dining Spend"
  value: string;   // e.g., "₹1,20,000"
  source: string;  // e.g., "assets - liabilities", "6 txns in 'food'"
  action: string;  // e.g., "Review your debt ratio"
};

function formatINR(num: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
}

interface SelectedUser {
  sessionId: string;
  phoneNumber: string;
}

interface AIAssistantInterfaceProps {
  selectedUser: SelectedUser;
}

export function generateInsightReport(mcp: any): InsightRow[] {
  const rows: InsightRow[] = [];

  // SummaryCard — Net Worth
  const assets = Array.isArray(mcp?.assets) ? mcp.assets.reduce((a: number, b: number) => a + b, 0) : (mcp?.assets ?? 0);
  const liabilities = Array.isArray(mcp?.liabilities) ? mcp.liabilities.reduce((a: number, b: number) => a + b, 0) : (mcp?.liabilities ?? 0);
  if (assets || liabilities) {
    rows.push({
      section: "SummaryCard",
      metric: "Net Worth",
      value: formatINR(assets - liabilities),
      source: "assets - liabilities",
      action: "Review your debt ratio",
    });
  } else {
    rows.push({
      section: "SummaryCard",
      metric: "Net Worth",
      value: "-",
      source: "-",
      action: "Upload MCP to get personalized insight",
    });
  }

  // SpendingChart — Food & Dining
  let foodTxns = [];
  if (Array.isArray(mcp?.transactions)) {
    const grouped: Record<string, any[]> = {};
    mcp.transactions.forEach((tx: any) => {
      const cat = tx.category?.toLowerCase() || "other";
      grouped[cat] = grouped[cat] || [];
      grouped[cat].push(tx);
    });
    foodTxns = grouped["food"] || grouped["food & dining"] || [];
    if (foodTxns.length > 0) {
      const total = foodTxns.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      rows.push({
        section: "SpendingChart",
        metric: "Food & Dining Spend",
        value: formatINR(total),
        source: `${foodTxns.length} txns in 'food'`,
        action: "Consider meal planning to reduce dining cost",
      });
    } else {
      // fallback to top category
      let maxCat = "";
      let maxTotal = 0;
      Object.entries(grouped).forEach(([cat, txns]) => {
        const total = txns.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        if (total > maxTotal) {
          maxTotal = total;
          maxCat = cat;
        }
      });
      if (maxCat) {
        rows.push({
          section: "SpendingChart",
          metric: `${maxCat.charAt(0).toUpperCase() + maxCat.slice(1)} Spend`,
          value: formatINR(maxTotal),
          source: `${grouped[maxCat].length} txns in '${maxCat}'`,
          action: "Review your top spending category for savings",
        });
      } else {
        rows.push({
          section: "SpendingChart",
          metric: "Food & Dining Spend",
          value: "-",
          source: "-",
          action: "Upload MCP to get personalized insight",
        });
      }
    }
  } else {
    rows.push({
      section: "SpendingChart",
      metric: "Food & Dining Spend",
      value: "-",
      source: "-",
      action: "Upload MCP to get personalized insight",
    });
  }

  // GoalCard — Top financial goal
  if (Array.isArray(mcp?.goals) && mcp.goals.length > 0) {
    const goal = mcp.goals[0];
    rows.push({
      section: "GoalCard",
      metric: goal.label || goal.name || "Goal",
      value: `${formatINR(goal.current)} / ${formatINR(goal.target)}`,
      source: goal.label || goal.name || "-",
      action: "Increase monthly saving by ₹2,000",
    });
  } else {
    rows.push({
      section: "GoalCard",
      metric: "Top Goal",
      value: "-",
      source: "-",
      action: "Upload MCP to get personalized insight",
    });
  }

  // TrendChart — Weekly Spend Avg
  if (Array.isArray(mcp?.transactions) && mcp.transactions.length > 0) {
    // Group by ISO week
    const weekTotals: Record<string, number> = {};
    mcp.transactions.forEach((tx: any) => {
      const date = new Date(tx.date);
      // Get ISO week string: YYYY-Www
      const year = date.getFullYear();
      const week = Math.ceil((((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7);
      const key = `${year}-W${week}`;
      weekTotals[key] = (weekTotals[key] || 0) + (tx.amount || 0);
    });
    const last4Weeks = Object.values(weekTotals).slice(-4);
    const avg = last4Weeks.length ? last4Weeks.reduce((a, b) => a + b, 0) / last4Weeks.length : 0;
    rows.push({
      section: "TrendChart",
      metric: "Weekly Spend Avg",
      value: last4Weeks.length ? formatINR(Math.round(avg)) : "-",
      source: last4Weeks.length ? `Last ${last4Weeks.length} weeks` : "-",
      action: "Set weekly budget to maintain consistency",
    });
  } else {
    rows.push({
      section: "TrendChart",
      metric: "Weekly Spend Avg",
      value: "-",
      source: "-",
      action: "Upload MCP to get personalized insight",
    });
  }

  // Sort/group by section name
  return rows.sort((a, b) => a.section.localeCompare(b.section));
}

export function AIAssistantInterface({ selectedUser }: AIAssistantInterfaceProps) {

  // Preview modal state
  const [showInsightPreview, setShowInsightPreview] = useState(false);
// InsightReportModal component
type InsightReportModalProps = {
  open: boolean;
  onClose: () => void;
  insights: InsightRow[];
};
function InsightReportModal({ open, onClose, insights }: InsightReportModalProps) {
  const handleExportCSV = () => {
    if (!insights || insights.length === 0) {
      alert('No insights to export.');
      return;
    }
    const header = ['Section', 'Metric', 'Value', 'Source', 'Action'];
    const rows = insights.map(row => [row.section, row.metric, row.value, row.source, row.action]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insight-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card rounded-xl shadow-2xl max-w-3xl w-full mx-4 p-6 relative"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span role="img" aria-label="report">📋</span> Exportable Insight Report
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-600 to-pink-500 text-white">
                  <tr>
                    <th className="py-2 px-3 text-left font-semibold">Section</th>
                    <th className="py-2 px-3 text-left font-semibold">Metric</th>
                    <th className="py-2 px-3 text-left font-semibold">Value</th>
                    <th className="py-2 px-3 text-left font-semibold">Source</th>
                    <th className="py-2 px-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white/60 dark:bg-zinc-800/60 divide-y divide-border">
                  {insights.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">No insights available</td>
                    </tr>
                  ) : (
                    insights.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-wallet-primary whitespace-nowrap">{row.section}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{row.metric}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{row.value}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{row.source}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{row.action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-wallet-accent transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-lg bg-wallet-primary text-wallet-primary-foreground flex items-center gap-2 font-medium shadow-button hover:bg-wallet-secondary transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
  // Helper functions and placeholders
  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good Morning";
  //   if (hour < 18) return "Good Afternoon";
  //   return "Good Evening";
  // };
  // const userName = "Moneyhead";
  // const insight = "Your savings are up 12% this month!";
  // Enhanced chat messages state with unique IDs and temp flags
interface Message {
  id?: string;
  text: string;
  sender: "user" | "ai";
  temp?: boolean;
}

const [messages, setMessages] = useState<Message[]>([]);
const chatEndRef = useRef<HTMLDivElement>(null);

// ChatMessage component for modern glassmorphic design
interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isTemp = message.temp;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
        isUser 
          ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white' 
          : isTemp
            ? 'bg-[#101828]/40 backdrop-blur-md text-slate-200 border border-slate-300/20 italic'
            : 'bg-[#101828]/60 backdrop-blur-md text-slate-100 border border-slate-300/20 shadow-sm'
      }`}>
        <div className="flex items-start gap-2">
          {!isUser && !isTemp && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="flex-1">
            {message.text}
            {isTemp && (
              <span className="inline-block ml-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  // Dummy receipts data for export
  const receipts = [
    { date: '2025-07-01', merchant: 'Amazon', amount: 1200 },
    { date: '2025-07-02', merchant: 'Uber', amount: 800 },
    { date: '2025-07-03', merchant: 'Starbucks', amount: 400 },
  ];

  // Export receipts as CSV (keep for receipts only)
  const handleExportReceiptsCSV = () => {
    const header = ['Date', 'Merchant', 'Amount'];
    const rows = receipts.map(r => [r.date, r.merchant, r.amount]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get MCP and setMCP from context at the top level (valid hook usage)
  const { mcp, setMCP } = useMCP();

  // Upload MCP JSON
  const handleUploadMCP = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const parsedData = await loadMCPFromFile(file);
          setMCP(parsedData);
          alert(`MCP data loaded successfully from: ${file.name}`);
        } catch (err: any) {
          alert(`Failed to load MCP: ${err.message || err}`);
        }
      }
    };
    input.click();
  };
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Simulate Gemini loading state
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const [activeCommandCategory, setActiveCommandCategory] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandSuggestions = {
    investments: [
      "How's my SIP performance this month?",
      "Should I invest more in mutual funds?",
      "Analyze my portfolio diversification",
      "What are the best tax-saving investments?",
      "Show me my investment returns vs inflation",
    ],
    expenses: [
      "Am I overspending on dining out?",
      "Show my monthly expense breakdown",
      "Where can I cut down my expenses?",
      "Compare this month vs last month spending",
      "Track my subscription expenses",
    ],
    planning: [
      "Help me plan for retirement",
      "Calculate my emergency fund target",
      "Create a budget for my next vacation",
      "Plan for my child's education expenses",
      "Set up a savings goal for home down payment",
    ],
  };

  const handleUploadFile = () => {
    setShowUploadAnimation(true);
    setTimeout(() => {
      const newFile = `Bank_Statement.pdf`;
      setUploadedFiles((prev) => [...prev, newFile]);
      setShowUploadAnimation(false);
    }, 1500);
  };

  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    setActiveCommandCategory(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    console.log("Send clicked");
    if (!inputValue.trim() || !selectedUser) {
      console.log("Early return: inputValue:", inputValue, "selectedUser:", selectedUser);
      return;
    }

    const userMessage = inputValue.trim();
    const userMessageId = `user-${Date.now()}-${Math.random()}`;
    const aiMessageId = `ai-${Date.now()}-${Math.random()}`;

    // Add user message instantly
    setMessages((prev) => [...prev, { 
      id: userMessageId,
      text: userMessage, 
      sender: "user" 
    }]);

    // Add temporary "Thinking..." AI message
    setMessages((prev) => [...prev, { 
      id: aiMessageId,
      text: "Thinking...", 
      sender: "ai",
      temp: true 
    }]);

    setIsLoading(true);
    setInputValue(""); // Clear input immediately

    try {
      console.log("About to call askGemini", selectedUser.sessionId);
      const response = await askGemini(
        userMessage,
        selectedUser.sessionId,
        selectedUser.phoneNumber
      );
      console.log("askGemini response:", response);
      
      // Replace temporary message with actual response
      setMessages((prev) => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: response, temp: false }
          : msg
      ));
    } catch (err) {
      console.error("Gemini request failed:", err);
      
      // Replace temporary message with error
      setMessages((prev) => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: "⚠️ Failed to get a response. Please try again.", temp: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-bg p-6 pt-24">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* <WelcomeBanner /><br></br> */}

        {/* Nucleus Logo with animated gradient - only show when no messages */}
        {messages.length === 0 && (
          <>
            <div className="mb-8 w-20 h-20 relative">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Welcome message */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  Ready to assist you
                </h1>
                <p className="text-muted-foreground max-w-md">
                  Your AI-powered financial advisor is here to help with investments, budgeting, and financial planning
                </p>
              </motion.div>
            </div>
          </>
        )}

        {/* Unified chat interface with messages and input */}
        <div className="w-full glass-card rounded-xl overflow-hidden mb-4 flex flex-col">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  Start a conversation with your AI assistant!
                </p>
                <p className="text-sm text-muted-foreground">
                  Try asking: "What is my net worth?"
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage key={msg.id || idx} message={msg} />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area - sticky bottom */}
          <div className="sticky bottom-0 bg-white/5 backdrop-blur-md border-t border-white/10 p-4 rounded-b-xl">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about your finances..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && inputValue.trim() && handleSendMessage()}
              className={`w-full bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground transition-all duration-300 ${isLoading ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}
              disabled={isLoading}
            />
          </div>

          {/* Uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-wallet-accent py-1 px-2 rounded-md border border-wallet-accent"
                  >
                    <FileText className="w-3 h-3 text-wallet-primary" />
                    <span className="text-xs text-wallet-accent-foreground">{file}</span>
                    <button
                      onClick={() =>
                        setUploadedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search, Deep Research, Reason functions and actions */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  searchEnabled
                    ? "bg-wallet-primary text-wallet-primary-foreground shadow-button"
                    : "bg-wallet-accent text-wallet-accent-foreground hover:bg-wallet-primary/10"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button
                onClick={() => setDeepResearchEnabled(!deepResearchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  deepResearchEnabled
                    ? "bg-wallet-primary text-wallet-primary-foreground shadow-button"
                    : "bg-wallet-accent text-wallet-accent-foreground hover:bg-wallet-primary/10"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Deep Research</span>
              </button>
              <button
                onClick={() => setReasonEnabled(!reasonEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  reasonEnabled
                    ? "bg-wallet-primary text-wallet-primary-foreground shadow-button"
                    : "bg-wallet-accent text-wallet-accent-foreground hover:bg-wallet-primary/10"
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Reason</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  inputValue.trim() && !isLoading
                    ? "bg-wallet-primary text-wallet-primary-foreground hover:bg-wallet-secondary shadow-button"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Upload files */}
          <div className="px-4 py-2 border-t border-border">
            <button
              onClick={handleUploadFile}
              className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              {showUploadAnimation ? (
                <motion.div
                  className="flex space-x-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-wallet-primary rounded-full"
                      variants={{
                        hidden: { opacity: 0, y: 5 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: i * 0.1,
                          },
                        },
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Upload Bank Statements</span>
            </button>
          </div>
        </div>

        {/* Command categories */}
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <CommandButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="Investments"
            isActive={activeCommandCategory === "investments"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "investments" ? null : "investments"
              )
            }
          />
          <CommandButton
            icon={<CreditCard className="w-5 h-5" />}
            label="Expenses"
            isActive={activeCommandCategory === "expenses"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "expenses" ? null : "expenses"
              )
            }
          />
          <CommandButton
            icon={<PiggyBank className="w-5 h-5" />}
            label="Planning"
            isActive={activeCommandCategory === "planning"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "planning" ? null : "planning"
              )
            }
          />
        </div>

        {/* Command suggestions */}
        <AnimatePresence>
          {activeCommandCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">
                    {activeCommandCategory === "investments"
                      ? "Investment insights"
                      : activeCommandCategory === "expenses"
                      ? "Expense analysis"
                      : "Financial planning"}
                  </h3>
                </div>
                <ul className="divide-y divide-border">
                  {commandSuggestions[
                    activeCommandCategory as keyof typeof commandSuggestions
                  ].map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleCommandSelect(suggestion)}
                      className="p-3 hover:bg-wallet-accent/50 cursor-pointer transition-colors duration-75"
                    >
                      <div className="flex items-center gap-3">
                        {activeCommandCategory === "investments" ? (
                          <TrendingUp className="w-4 h-4 text-wallet-primary" />
                        ) : activeCommandCategory === "expenses" ? (
                          <CreditCard className="w-4 h-4 text-wallet-primary" />
                        ) : (
                          <PiggyBank className="w-4 h-4 text-wallet-primary" />
                        )}
                        <span className="text-sm text-foreground">
                          {suggestion}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
      {/* Floating Export/Upload buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <button
          className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-800/60 backdrop-blur-lg shadow transition-all hover:shadow-lg hover:scale-105 text-foreground"
          onClick={() => setShowInsightPreview(true)}
        >
          <Download className="w-5 h-5" />
          Export Insights
        </button>
        <button
          className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-800/60 backdrop-blur-lg shadow transition-all hover:shadow-lg hover:scale-105 text-foreground"
          onClick={handleUploadMCP}
        >
          <Upload className="w-5 h-5" />
          Upload MCP
        </button>
      </div>

      {/* Insight Report Modal Preview */}
      <InsightReportModal
        open={showInsightPreview}
        onClose={() => setShowInsightPreview(false)}
        insights={mcp ? generateInsightReport(mcp) : []}
      />
    </>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
        isActive
          ? "glass-card border-wallet-primary shadow-button"
          : "glass-card border-border hover:border-wallet-primary/50"
      }`}
    >
      <div className={`${isActive ? "text-wallet-primary" : "text-muted-foreground"}`}>
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-wallet-primary" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}