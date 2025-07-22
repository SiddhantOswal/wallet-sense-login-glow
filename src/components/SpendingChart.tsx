import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

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
  const data = dataObj
    ? Object.entries(dataObj).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div
      className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}
    >
      <h3 className="font-bold text-lg text-foreground mb-4">Spending by Category</h3>
      {data.length === 0 ? (
        <div className="text-muted-foreground text-sm">No spending data yet.</div>
      ) : (
        <motion.div
          key={JSON.stringify(data)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
