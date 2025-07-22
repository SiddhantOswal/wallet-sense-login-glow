import React, { useState, useRef } from "react";
"use client";

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
import { motion, AnimatePresence } from "framer-motion";

export function AIAssistantInterface() {
  // Simulated chat messages state
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([
    { text: 'Welcome to WalletSense!', sender: 'ai' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Export receipts as CSV
  const handleExportCSV = () => {
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

  // Upload MCP JSON
  const handleUploadMCP = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // You can handle the file here (e.g., parse JSON)
        alert(`Uploaded MCP JSON: ${file.name}`);
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text: inputValue, sender: 'user' }]);
      setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [...prev, { text: 'Gemini response...', sender: 'ai' }]);
        setInputValue("");
      }, 2000); // Simulate Gemini response
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-bg p-6">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* Chat messages */}
          <div className="w-full max-w-2xl mx-auto mb-6 bg-white/40 dark:bg-zinc-800/40 rounded-xl p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 320 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-base px-3 py-2 rounded-lg ${msg.sender === 'ai' ? 'bg-blue-50 dark:bg-zinc-700 text-blue-900 dark:text-blue-200' : 'bg-wallet-accent text-wallet-accent-foreground'}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
        {/* WalletSense Logo with animated gradient */}
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
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Ready to assist you
            </h1>
            <p className="text-muted-foreground max-w-md">
              Your AI-powered financial advisor is here to help with investments, budgeting, and financial planning
            </p>
          </motion.div>
        </div>

        {/* Input area with integrated functions and file upload */}
        <div className="w-full glass-card rounded-xl overflow-hidden mb-4">
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about your finances..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
          onClick={handleExportCSV}
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
        <button
          className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-800/60 backdrop-blur-lg shadow transition-all hover:shadow-lg hover:scale-105 text-foreground"
          onClick={handleUploadMCP}
        >
          <Upload className="w-5 h-5" />
          Upload MCP
        </button>
      </div>
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