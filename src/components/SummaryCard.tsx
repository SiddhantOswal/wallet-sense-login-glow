import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Sparkles } from 'lucide-react';

const SummaryCard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const insights = [
    "You spent ₹12,000 on food this month - 8% more than usual",
    "Net worth increased 4% this quarter",
    "Your emergency fund covers 6.2 months of expenses"
  ];

  if (isLoading) {
    return (
      <EnhancedCard className="backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-0 py-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Your Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Shimmer skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse mt-2" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </EnhancedCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EnhancedCard className="backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-0 py-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Your Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
              <p className="text-sm text-foreground leading-relaxed">
                {insight}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </EnhancedCard>
    </motion.div>
  );
};

export default SummaryCard;