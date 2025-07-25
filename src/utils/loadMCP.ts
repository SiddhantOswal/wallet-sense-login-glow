import type { MCP } from '../../types/mcp';

/**
 * Loads and validates an MCP object from a File (JSON).
 * @param file File object from input[type="file"]
 * @returns Promise<MCP>
 * @throws Error if file is not valid MCP JSON
 */
export async function loadMCPFromFile(file: File): Promise<MCP> {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error('File is not valid JSON.');
  }

  // Basic structure validation
  if (
    typeof data !== 'object' ||
    data === null ||
    !('assets' in data) ||
    !('liabilities' in data) ||
    !('goals' in data) ||
    !('transactions' in data)
  ) {
    throw new Error('File does not contain required MCP fields (assets, liabilities, goals, transactions).');
  }

  // Optionally, check that these are arrays
  const { assets, liabilities, goals, transactions } = data as Record<string, unknown>;
  if (!Array.isArray(assets) || !Array.isArray(liabilities) || !Array.isArray(goals) || !Array.isArray(transactions)) {
    throw new Error('MCP fields assets, liabilities, goals, and transactions must be arrays.');
  }

  // Return as MCP (runtime validation is shallow)
  return data as MCP;
} 