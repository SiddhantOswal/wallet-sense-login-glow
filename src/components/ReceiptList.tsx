import { motion } from 'framer-motion';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { ShoppingBag, Coffee, Car, Home, Utensils, Receipt } from 'lucide-react';

const ReceiptList = () => {
  const expenses = [
    {
      id: 1,
      merchant: "Swiggy",
      amount: 499,
      category: "food",
      icon: Utensils,
      date: "2 hours ago",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      id: 2,
      merchant: "Amazon",
      amount: 1299,
      category: "shopping",
      icon: ShoppingBag,
      date: "1 day ago",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      id: 3,
      merchant: "Starbucks",
      amount: 350,
      category: "food",
      icon: Coffee,
      date: "2 days ago",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      id: 4,
      merchant: "Uber",
      amount: 180,
      category: "transport",
      icon: Car,
      date: "3 days ago",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      id: 5,
      merchant: "Electricity Bill",
      amount: 2100,
      category: "utilities",
      icon: Home,
      date: "5 days ago",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <EnhancedCard className="backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-0 py-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Receipt className="size-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {expenses.map((expense, index) => {
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
                        {expense.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </EnhancedCard>
    </motion.div>
  );
};

export default ReceiptList;