import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = () => {
  const insights = [
    { icon: TrendingUp, text: "Your investments are up 8.2% this month", color: "text-green-600" },
    { icon: Shield, text: "Emergency fund covers 4.2 months of expenses", color: "text-blue-600" },
    { icon: Brain, text: "Suggested: Increase SIP by ₹2,000 for better returns", color: "text-purple-600" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Summary</h3>
        </div>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <insight.icon className={`w-4 h-4 mt-0.5 ${insight.color}`} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;