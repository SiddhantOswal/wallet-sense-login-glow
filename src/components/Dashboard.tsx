import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface';
import { Card } from '@/components/ui/card';
import SpendingChart from '@/components/SpendingChart';
import TrendChart from '@/components/TrendChart';
import CategoryBarChart from '@/components/CategoryBarChart';
import DailySpendHeatmap from '@/components/DailySpendHeatmap';
import { TrendingUp, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import SummaryCard from '@/components/SummaryCard';
import GoalCard from '@/components/GoalCard';
import ReceiptList from '@/components/ReceiptList';
import WelcomeBanner from '@/components/ui/WelcomeBanner';
// ...existing code...
const Dashboard = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col">
      {/* Welcome Banner above everything */}
      <div className="w-full z-20">
        <WelcomeBanner onLogout={onLogout} />
      </div>
      <div className="flex flex-1">
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
            <div className="mb-4">
              <SummaryCard />
            </div>
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
              <CategoryBarChart
                data={[{ week: 'Jul 1', Food: 1200, Shopping: 800, Bills: 500 }, { week: 'Jul 8', Food: 900, Shopping: 950, Bills: 600 }, { week: 'Jul 15', Food: 1100, Shopping: 700, Bills: 550 }, { week: 'Jul 22', Food: 1000, Shopping: 850, Bills: 650 }]}
              />
              <DailySpendHeatmap
                data={[
                  { date: '2025-07-01', amount: 1200 },
                  { date: '2025-07-02', amount: 800 },
                  { date: '2025-07-03', amount: 400 },
                  { date: '2025-07-04', amount: 600 },
                  { date: '2025-07-05', amount: 300 },
                  { date: '2025-07-06', amount: 0 },
                ]}
              />
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
    </div>
  );
}

export default Dashboard;