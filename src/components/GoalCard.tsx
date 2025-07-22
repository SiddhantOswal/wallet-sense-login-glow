import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const GoalCard = () => {
  const goal = {
    title: "Emergency Fund Goal",
    target: 25000,
    current: 18500,
    deadline: "Sept 30, 2024",
    daysLeft: 45
  };

  const progressPercentage = (goal.current / goal.target) * 100;
  const isOnTrack = progressPercentage >= 70;
  const statusColor = isOnTrack ? "text-green-600" : "text-orange-600";
  const progressColor = isOnTrack ? "bg-green-500" : "bg-orange-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="glass-card p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Savings Goal</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{goal.title}</span>
              <span className={`text-sm font-semibold ${statusColor}`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-muted"
            />
            
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>₹{goal.current.toLocaleString()}</span>
              <span>₹{goal.target.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {goal.daysLeft} days left · {goal.deadline}
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need ₹{(goal.target - goal.current).toLocaleString()} more
            </p>
            <p className={`text-xs font-medium ${statusColor}`}>
              {isOnTrack ? "On track!" : "Behind schedule"}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalCard;