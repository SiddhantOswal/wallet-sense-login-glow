import React from 'react';
import { useMCP } from '@/contexts/MCPContext';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity: React.FC = () => {
  const { mcp } = useMCP();

  if (!mcp || !mcp.transactions || mcp.transactions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-4 py-2">
        No recent activity found. Upload your MCP file to view transactions.
      </div>
    );
  }

  const recentTx = [...mcp.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">
        Recent Activity <span className="text-muted-foreground text-sm">(Last 10 transactions)</span>
      </h2>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {recentTx.map((tx, idx) => {
          const label = tx.category || tx.merchant || 'Transaction';
          const timeAgo = formatDistanceToNow(new Date(tx.date), { addSuffix: true });
          const isPositive = tx.amount > 0;
          return (
            <div key={tx.id || idx} className="flex items-center justify-between py-2 px-1">
              <div>
                <div className="text-zinc-700 dark:text-zinc-200 font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{timeAgo}</div>
              </div>
              <div className={isPositive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity; 