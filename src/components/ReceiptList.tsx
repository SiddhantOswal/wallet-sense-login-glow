import React from 'react';
import { useMCP } from '@/contexts/MCPContext';
import { motion } from 'framer-motion';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { ShoppingBag, Coffee, Car, Home, Utensils, Receipt } from 'lucide-react';

const categoryIcons: Record<string, string> = {
  food: '🍔',
  groceries: '🛒',
  shopping: '🛍️',
  travel: '✈️',
  bills: '💡',
  entertainment: '🎬',
  health: '💊',
  transport: '🚗',
  other: '💳',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function getCategoryIcon(category: string) {
  return categoryIcons[category?.toLowerCase()] || categoryIcons['other'];
}

const sampleExpenses = [
  {
    id: 1,
    merchant: "Swiggy",
    amount: 499,
    category: "food",
    icon: Utensils,
    date: "2024-07-10T10:00:00Z",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20"
  },
  {
    id: 2,
    merchant: "Amazon",
    amount: 1299,
    category: "shopping",
    icon: ShoppingBag,
    date: "2024-07-09T12:00:00Z",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    id: 3,
    merchant: "Starbucks",
    amount: 350,
    category: "food",
    icon: Coffee,
    date: "2024-07-08T08:00:00Z",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  },
  {
    id: 4,
    merchant: "Uber",
    amount: 180,
    category: "transport",
    icon: Car,
    date: "2024-07-07T15:00:00Z",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    id: 5,
    merchant: "Electricity Bill",
    amount: 2100,
    category: "bills",
    icon: Home,
    date: "2024-07-05T18:00:00Z",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
  }
];

const ReceiptList: React.FC = () => {
  const { mcp } = useMCP();

  let content;
  if (mcp && mcp.transactions && mcp.transactions.length > 0) {
    // Sort by most recent date
    const sorted = [...mcp.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recent = sorted.slice(0, 5);
    content = (
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[200px] overflow-y-auto">
        {recent.map(txn => (
          <li key={txn.id} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(txn.category)}</span>
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">{txn.merchant}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(txn.date)}</div>
              </div>
            </div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">₹{txn.amount.toLocaleString()}</div>
          </li>
        ))}
      </ul>
    );
  } else {
    // Show sample content as a visual example
    content = (
      <>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-2 mb-2">
        Your recent expenses will appear here once data is available. Upload your MCP file to get started.
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {sampleExpenses.map((expense, index) => {
            const IconComponent = expense.icon;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  {/* Category Icon */}
                  <div className={`p-2 rounded-full ${expense.bgColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`size-4 ${expense.color}`} />
                  </div>

                  {/* Expense Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {expense.merchant}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ₹{expense.amount}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow mb-4">
      <div className="mb-2 font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
        <span role="img" aria-label="receipts">🧾</span>
        Recent Transactions
      </div>
      {content}
    </div>
  );
};

export default ReceiptList;