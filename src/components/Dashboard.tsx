import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface';
import { Card } from '@/components/ui/card';
import SpendingChart from '@/components/SpendingChart';
import TrendChart from '@/components/TrendChart';
// import CategoryBarChart from '@/components/CategoryBarChart';
// import DailySpendHeatmap from '@/components/DailySpendHeatmap';
import { TrendingUp, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import SummaryCard from '@/components/SummaryCard';
import GoalCard from '@/components/GoalCard';
import ReceiptList from '@/components/ReceiptList';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-bg flex">
      {/* Left side - AI Assistant (60%) */}
      <div className="w-[60%] border-r border-border">
        <AIAssistantInterface />
      </div>
      
      {/* Right side - Financial Overview (40%) */}
      <div className="w-[40%] bg-muted/20 flex flex-col h-screen max-h-screen">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 h-full max-h-screen">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Financial Overview
            </h2>
            <p className="text-muted-foreground text-sm">
              Quick insights at a glance
            </p>
          </div>

          {/* AI Financial Summary */}
          <SummaryCard />

          {/* Savings Goal */}
          <GoalCard />

          {/* Recent Expenses */}
          <ReceiptList />

          {/* Charts Section */}
          <div className="space-y-4">
            <SpendingChart
              dataObj={{ Food: 1200, Shopping: 800, Travel: 400, Bills: 600, Entertainment: 300 }}
            />
            <TrendChart
              data={[{ week: 'Jul 1', amount: 4200 }, { week: 'Jul 8', amount: 3800 }, { week: 'Jul 15', amount: 4500 }, { week: 'Jul 22', amount: 3900 }]}
            />
            {/* Placeholder for CategoryBarChart */}
            <div className="rounded-md shadow-sm p-4 bg-white dark:bg-muted/80">
              <h3 className="font-bold text-lg text-foreground mb-4">Spend by Category</h3>
              <div className="text-muted-foreground text-sm">[CategoryBarChart will appear here]</div>
            </div>
            {/* Optional: DailySpendHeatmap */}
            <div className="rounded-md shadow-sm p-4 bg-white dark:bg-muted/80">
              <h3 className="font-bold text-lg text-foreground mb-4">Daily Spend Heatmap</h3>
              <div className="text-muted-foreground text-sm">[DailySpendHeatmap will appear here]</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <div className="space-y-2">
              {/* ...existing code... */}
              {[
                { action: "SIP Investment", amount: "₹5,000", time: "2 hours ago", type: "investment" },
                { action: "Grocery Shopping", amount: "₹2,840", time: "1 day ago", type: "expense" },
                { action: "Salary Credited", amount: "₹75,000", time: "3 days ago", type: "income" },
              ].map((activity, index) => (
                <Card key={index} className="glass-card p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <p className={`text-sm font-semibold ${
                      activity.type === 'income' ? 'text-green-600' : 
                      activity.type === 'investment' ? 'text-wallet-primary' : 'text-orange-600'
                    }`}>
                      {activity.type === 'expense' ? '-' : '+'}{activity.amount}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <Card className="glass-card p-4">
              <div className="space-y-2">
                <p className="text-sm text-foreground font-medium">💡 Smart Tip</p>
                <p className="text-xs text-muted-foreground">
                  You're spending 15% less on dining out this month. Consider investing this saved amount in your emergency fund.
                </p>
              </div>
            </Card>
            <Card className="glass-card p-4">
              <div className="space-y-2">
                <p className="text-sm text-foreground font-medium">📊 Portfolio Alert</p>
                <p className="text-xs text-muted-foreground">
                  Your mutual fund portfolio is well-diversified. Consider adding some international exposure for better risk distribution.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;