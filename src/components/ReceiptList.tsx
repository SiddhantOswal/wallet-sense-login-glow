import { Card } from '@/components/ui/card';
import { Receipt, ShoppingBag, Coffee, Car, Home, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const ReceiptList = () => {
  const activities = [
    { 
      merchant: "Zomato", 
      amount: 320, 
      icon: Utensils, 
      date: "2 days ago", 
      type: "expense",
      color: "text-red-500"
    },
    { 
      merchant: "Uber", 
      amount: 180, 
      icon: Car, 
      date: "3 days ago", 
      type: "expense",
      color: "text-blue-500"
    },
    { 
      merchant: "Starbucks", 
      amount: 450, 
      icon: Coffee, 
      date: "4 days ago", 
      type: "expense",
      color: "text-amber-600"
    },
    { 
      merchant: "Amazon", 
      amount: 1250, 
      icon: ShoppingBag, 
      date: "5 days ago", 
      type: "expense",
      color: "text-orange-500"
    },
    { 
      merchant: "Rent Payment", 
      amount: 15000, 
      icon: Home, 
      date: "1 week ago", 
      type: "expense",
      color: "text-purple-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="glass-card p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-3">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.merchant}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">
                  -₹{activity.amount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Total spent this week: ₹17,200
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReceiptList;