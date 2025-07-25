import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMCP } from '@/contexts/MCPContext';

export interface CategoryBarChartProps {
  data?: Array<{ week: string; [category: string]: number | string }>;
  className?: string;
}

const COLORS = [
  '#2563eb', // Blue-600
  '#d946ef', // Pink-500
  'url(#bluePinkGradient)', // SVG gradient fallback
  '#2563eb', // Blue-600
  '#d946ef', // Pink-500
  '#2563eb', // Blue-600
  '#d946ef', // Pink-500
];

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

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data = [], className }) => {
  const { mcp } = useMCP();

  // Group MCP transactions by week and category if available
  const liveData = useMemo(() => {
    if (mcp && mcp.transactions && mcp.transactions.length > 0) {
      // First, collect all unique categories
      const allCategories = Array.from(new Set(mcp.transactions.map(txn => txn.category)));
      // Group by week start date string
      const weekMap: Record<string, { week: string; [cat: string]: number | string }> = {};
      for (const txn of mcp.transactions) {
        const date = new Date(txn.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().slice(0, 10);
        const weekLabel = formatWeekLabel(weekStart);
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = { week: weekLabel };
          for (const cat of allCategories) {
            weekMap[weekKey][cat] = 0;
          }
        }
        weekMap[weekKey][txn.category] = (weekMap[weekKey][txn.category] as number) + txn.amount;
      }
      // Sort by week start ascending
      return Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week));
    }
    return null;
  }, [mcp]);

  // Get all category keys except 'week'
  const categories = (liveData && liveData.length > 0)
    ? Object.keys(liveData[0]).filter((key) => key !== 'week')
    : (data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'week') : []);

  const showLive = !!liveData && liveData.length > 0;

  return (
    <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
      <h3 className="font-bold text-lg text-foreground mb-4">Spend by Category</h3>
      {!showLive ? (
        <>
          <p className="text-muted-foreground text-sm mb-2">Upload your MCP file to view weekly category breakdown.</p>
          {data && data.length > 0 && categories.length > 0 && (
            <motion.div
              key={JSON.stringify(data)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tickFormatter={formatRupees} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatRupees(value)} labelFormatter={label => `Week: ${label}`} />
                  <Legend wrapperStyle={{ marginTop: 12 }} />
                  {categories.map((cat, idx) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      fill={COLORS[idx % COLORS.length]}
                      name={cat}
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      isAnimationActive={true}
                    />
                  ))}
                </BarChart>
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
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={liveData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tickFormatter={formatRupees} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatRupees(value)} labelFormatter={label => `Week: ${label}`} />
              <Legend wrapperStyle={{ marginTop: 12 }} />
              {categories.map((cat, idx) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  fill={COLORS[idx % COLORS.length]}
                  name={cat}
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                  isAnimationActive={true}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryBarChart;
