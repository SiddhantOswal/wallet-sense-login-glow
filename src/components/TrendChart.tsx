import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useMCP } from '@/contexts/MCPContext';

export interface TrendChartProps {
  data?: { week: string; amount: number }[];
  className?: string;
}

const formatRupees = (value: number) => `₹${value.toLocaleString()}`;

// Helper to get week start date (Monday) for a given date
function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to format week range label
function formatWeekLabel(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)}–${end.toLocaleDateString('en-US', options)}`;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data = [], className }) => {
  const { mcp } = useMCP();

  // Group MCP transactions by week if available
  const liveData = useMemo(() => {
    if (mcp && mcp.transactions && mcp.transactions.length > 0) {
      // Group by week start date string
      const weekMap: Record<string, { week: string; amount: number }> = {};
      for (const txn of mcp.transactions) {
        const date = new Date(txn.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().slice(0, 10);
        const weekLabel = formatWeekLabel(weekStart);
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = { week: weekLabel, amount: 0 };
        }
        weekMap[weekKey].amount += txn.amount;
      }
      // Sort by week start ascending
      return Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week));
    }
    return null;
  }, [mcp]);

  const showLive = !!liveData && liveData.length > 0;

  return (
    <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
      <h3 className="font-bold text-lg text-foreground mb-4">Weekly Trend</h3>
      {!showLive ? (
        <>
          <p className="text-muted-foreground text-sm mb-2">Your weekly trends will appear here once data is available. Upload your MCP file to get started.</p>
          {data && data.length > 0 && (
            <motion.div
              key={JSON.stringify(data)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tickFormatter={formatRupees} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatRupees(value)} labelFormatter={label => `Week: ${label}`} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: '#6366F1', strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                  />
                </LineChart>
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tickFormatter={formatRupees} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatRupees(value)} labelFormatter={label => `Week: ${label}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 5, stroke: '#6366F1', strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default TrendChart;
