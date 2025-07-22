import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface TrendChartProps {
  data?: { week: string; amount: number }[];
  className?: string;
}

const formatRupees = (value: number) => `₹${value.toLocaleString()}`;

export const TrendChart: React.FC<TrendChartProps> = ({ data = [], className }) => {
  return (
    <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
      <h3 className="font-bold text-lg text-foreground mb-4">Weekly Trend</h3>
      {(!data || data.length === 0) ? (
        <div className="text-muted-foreground text-sm">No weekly trend data yet.</div>
      ) : (
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
      )}
    </div>
  );
};

export default TrendChart;
