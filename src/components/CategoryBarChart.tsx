import React from 'react';
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

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data = [], className }) => {
  // Get all category keys except 'week'
  const categories = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== 'week')
    : [];

  return (
    <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
      <h3 className="font-bold text-lg text-foreground mb-4">Spend by Category</h3>
      {(!data || data.length === 0 || categories.length === 0) ? (
        <div className="text-muted-foreground text-sm">No category data yet.</div>
      ) : (
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
    </div>
  );
};

export default CategoryBarChart;
