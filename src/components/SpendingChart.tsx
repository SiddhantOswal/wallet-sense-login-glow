import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
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
      )}
    </div>
  );
};

export default SpendingChart;
