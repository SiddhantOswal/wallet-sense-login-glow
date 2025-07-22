import React from 'react';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';

export interface DailySpendHeatmapProps {
  data?: Array<{ date: string; amount: number }>;
  className?: string;
}

// Color scale for spend intensity
const COLOR_SCALE = [
  'bg-gray-200',    // 0
  'bg-blue-100',    // low
  'bg-blue-300',    // medium
  'bg-blue-500',    // high
  'bg-blue-700',    // very high
];

// Get color index based on amount and thresholds
function getColorIdx(amount: number, thresholds: number[]) {
  if (amount === 0) return 0;
  if (amount <= thresholds[0]) return 1;
  if (amount <= thresholds[1]) return 2;
  if (amount <= thresholds[2]) return 3;
  return 4;
}

export const DailySpendHeatmap: React.FC<DailySpendHeatmapProps> = ({ data = [], className }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
        <h3 className="font-bold text-lg text-foreground mb-4">Daily Spend Heatmap</h3>
        <div className="text-muted-foreground text-sm">No daily data yet.</div>
      </div>
    );
  }

  // Sort and parse dates
  const parsed = data.map(d => ({ ...d, dateObj: parseISO(d.date) })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  const minDate = startOfWeek(parsed[0].dateObj, { weekStartsOn: 0 });
  const maxDate = parsed[parsed.length - 1].dateObj;
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const weeks = Math.ceil(totalDays / 7);

  // Build grid: rows = weeks, cols = days
  const grid: { date: Date; amount: number }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const row: { date: Date; amount: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = addDays(minDate, w * 7 + d);
      const found = parsed.find(p => isSameDay(p.dateObj, cellDate));
      row.push({ date: cellDate, amount: found ? found.amount : 0 });
    }
    grid.push(row);
  }

  // Compute spend thresholds for legend/colors
  const amounts = parsed.map(p => p.amount);
  const max = Math.max(...amounts, 0);
  const thresholds = [
    Math.ceil(max * 0.25),
    Math.ceil(max * 0.5),
    Math.ceil(max * 0.75),
  ];

  return (
    <div className={`rounded-md shadow-sm p-4 bg-white dark:bg-muted/80 ${className || ''}`}>
      <h3 className="font-bold text-lg text-foreground mb-4">Daily Spend Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1">
          {/* Render grid cells */}
          {grid.map((row, wIdx) =>
            row.map((cell, dIdx) => {
              const colorIdx = getColorIdx(cell.amount, thresholds);
              return (
                <div
                  key={`${wIdx}-${dIdx}`}
                  className={`w-6 h-6 rounded ${COLOR_SCALE[colorIdx]} cursor-pointer border border-gray-100 dark:border-gray-800 relative group`}
                  title={`${format(cell.date, 'MMM d')}: ₹${cell.amount}`}
                >
                  {/* Tooltip on hover */}
                  {cell.amount > 0 && (
                    <div className="absolute z-10 hidden group-hover:block left-1/2 -translate-x-1/2 top-7 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {format(cell.date, 'MMM d')}: ₹{cell.amount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-xs text-muted-foreground">Legend:</span>
        <span className="w-5 h-5 rounded bg-gray-200 border border-gray-300 inline-block" />
        <span className="text-xs">0</span>
        <span className="w-5 h-5 rounded bg-blue-100 border border-blue-200 inline-block" />
        <span className="text-xs">1 - {thresholds[0]}</span>
        <span className="w-5 h-5 rounded bg-blue-300 border border-blue-400 inline-block" />
        <span className="text-xs">{thresholds[0] + 1} - {thresholds[1]}</span>
        <span className="w-5 h-5 rounded bg-blue-500 border border-blue-600 inline-block" />
        <span className="text-xs">{thresholds[1] + 1} - {thresholds[2]}</span>
        <span className="w-5 h-5 rounded bg-blue-700 border border-blue-800 inline-block" />
        <span className="text-xs">{thresholds[2] + 1}+</span>
      </div>
    </div>
  );
};

export default DailySpendHeatmap;
