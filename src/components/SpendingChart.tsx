import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useMCP } from '@/contexts/MCPContext';

const COLORS = [
  '#2563eb', // Blue-600
  '#3b82f6', // Blue-500
  '#60a5fa', // Blue-400
  '#d946ef', // Pink-500
  '#ec4899', // Pink-400
  '#f472b6', // Pink-300
];

export interface SpendingChartProps {
  dataObj?: Record<string, number>;
  className?: string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ dataObj, className }) => {
  const { mcp } = useMCP();

  // Group MCP transactions by category if available
  const liveData = useMemo(() => {
    if (mcp && mcp.transactions && mcp.transactions.length > 0) {
      const grouped: Record<string, number> = {};
      for (const txn of mcp.transactions) {
        if (!txn.category) continue;
        grouped[txn.category] = (grouped[txn.category] || 0) + txn.amount;
      }
      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }
    return null;
  }, [mcp]);

  // Use sample dataObj for visual example if no live data
  const sampleData = dataObj
    ? Object.entries(dataObj).map(([name, value]) => ({ name, value }))
    : [];

  const showLive = !!liveData && liveData.length > 0;

  return (
    <div
      className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}
    >
      <h3 className="font-bold text-lg text-foreground mb-4">Spending by Category</h3>
      {!showLive ? (
        <>
          <p className="text-muted-foreground text-sm mb-2">Your spending chart will appear here once data is available. Upload your MCP file to get started.</p>
          {sampleData.length > 0 && (
            <motion.div
              key={JSON.stringify(sampleData)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={sampleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name }) => name}
                  >
                    {sampleData.map((entry, idx) => (
                      <Cell key={`cell-sample-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `₹${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ marginTop: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          key={JSON.stringify(liveData)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={liveData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
              >
                {liveData.map((entry, idx) => (
                  <Cell key={`cell-live-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString()}`,
                  name,
                ]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default SpendingChart;
