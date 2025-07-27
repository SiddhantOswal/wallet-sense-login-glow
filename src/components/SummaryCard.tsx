import React from 'react';
import { useMCP } from '@/contexts/MCPContext';
import { fetchSummaries } from '@/api/fetchSummaries';

const currency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const sample = {
  assets: 250000,
  liabilities: 80000,
  goals: 3,
};

interface SummaryCardProps {
  sessionId?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ sessionId }) => {
  const { mcp } = useMCP();
  const [summaries, setSummaries] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch summaries when component mounts or sessionId changes
  React.useEffect(() => {
    const loadSummaries = async () => {
      if (!sessionId) {
        console.log('No sessionId available, skipping summary fetch');
        return;
      }
      
      console.log('Fetching summaries for sessionId:', sessionId);
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedSummaries = await fetchSummaries(sessionId);
        console.log('Fetched summaries:', fetchedSummaries);
        setSummaries(fetchedSummaries);
      } catch (err) {
        console.error('Failed to load summaries:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummaries();
  }, [sessionId]);

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="summary" className="text-xl">📊</span>
          <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Financial Summary</span>
        </div>
        {sessionId && (
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              fetchSummaries(sessionId)
                .then(setSummaries)
                .catch((err) => {
                  setError(err.message);
                  console.error('Failed to refresh summaries:', err);
                })
                .finally(() => setIsLoading(false));
            }}
            disabled={isLoading}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-50 transition-colors"
            aria-label="Refresh summaries"
          >
            {isLoading ? '🔄' : '↻'}
          </button>
        )}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-2" role="status" aria-live="polite">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/5"></div>
          </div>
          <span className="sr-only">Loading summaries...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-zinc-500 dark:text-zinc-400 text-sm" role="alert">
          No summaries available.
        </div>
      )}

      {/* Personalized Summaries */}
      {!isLoading && !error && summaries.length > 0 && (
        <ul 
          className="list-disc pl-5 space-y-1 text-zinc-900 dark:text-zinc-100 text-sm"
          role="list"
          aria-label="Personalized financial summaries"
        >
          {summaries.map((summary, index) => (
            <li key={index} className="leading-relaxed">
              {summary}
            </li>
          ))}
        </ul>
      )}

      {/* Fallback for no summaries */}
      {!isLoading && !error && summaries.length === 0 && (
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">
          No summaries available.
        </div>
      )}

      {/* MCP Data Display (when no personalized summaries) */}
      {!mcp && !isLoading && !error && summaries.length === 0 && (
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
      )}

      {/* MCP Data Display (when available) */}
      {mcp && !isLoading && !error && summaries.length === 0 && (
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