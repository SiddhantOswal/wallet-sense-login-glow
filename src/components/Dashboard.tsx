import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface';
import SummaryCard from '@/components/SummaryCard';
import GoalCard from '@/components/GoalCard';
import ReceiptList from '@/components/ReceiptList';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-bg flex">
      {/* Left side - AI Assistant (60%) */}
      <div className="w-[60%] lg:w-[60%] md:w-full border-r border-border">
        <AIAssistantInterface />
      </div>
      
      {/* Right side - Financial Dashboard Sidebar (40%) */}
      <div className="w-[40%] lg:w-[40%] md:hidden p-6 overflow-y-auto bg-muted/20 backdrop-blur-sm">
        <div className="space-y-6 sticky top-6">
          <SummaryCard />
          <GoalCard />
          <ReceiptList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;