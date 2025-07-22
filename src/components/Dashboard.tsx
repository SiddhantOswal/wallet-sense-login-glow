import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface';
import { Card } from '@/components/ui/card';
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-wallet-primary">₹2,45,680</p>
                </div>
                <DollarSign className="w-8 h-8 text-wallet-secondary" />
              </div>
            </Card>

            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-semibold text-foreground">₹38,420</p>
                  <p className="text-xs text-green-600">+12% vs last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investments</p>
                  <p className="text-xl font-semibold text-foreground">₹1,85,200</p>
                  <p className="text-xs text-wallet-primary">8 active SIPs</p>
                </div>
                <PiggyBank className="w-8 h-8 text-wallet-primary" />
              </div>
            </Card>

            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-xl font-semibold text-foreground">₹28,640</p>
                  <p className="text-xs text-orange-600">Budget: ₹35,000</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
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