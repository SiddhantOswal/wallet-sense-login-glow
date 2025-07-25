import React from 'react';
import { useMCP } from '@/contexts/MCPContext';

const currency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const sample = {
  assets: 250000,
  liabilities: 80000,
  goals: 3,
};

const SummaryCard: React.FC = () => {
  const { mcp } = useMCP();

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
      <div className="mb-2 flex items-center gap-2">
        <span role="img" aria-label="summary" className="text-xl">📊</span>
        <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Financial Summary</span>
      </div>
      {!mcp ? (
        <>
          <div className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
            Upload your MCP JSON to view your personalized summary.
          </div>
          <ul className="list-disc pl-5 space-y-1 text-zinc-900 dark:text-zinc-100 opacity-70">
            <li> Total Assets: {currency(sample.assets)} </li>
            <li> Total Liabilities: {currency(sample.liabilities)} </li>
            <li> You have {sample.goals} active financial goals </li>
          </ul>
        </>
      ) : (
        <ul className="list-disc pl-5 space-y-1 text-zinc-900 dark:text-zinc-100">
          <li> Total Assets: {currency(mcp.assets.reduce((sum, asset) => sum + (asset.value ?? 0), 0))} </li>
          <li> Total Liabilities: {currency(mcp.liabilities.reduce((sum, liability) => sum + (liability.value ?? 0), 0))} </li>
          <li> You have {mcp.goals.length} active financial goals </li>
        </ul>
      )}
    </div>
  );
};

export default SummaryCard;