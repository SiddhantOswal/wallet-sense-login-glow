// MCP data structure interfaces for Fi hackathon
// Strict, exportable, and scalable for use across agents, charts, and UI

export interface MCPAsset {
  type: string;
  value: number;
}

export interface MCPLiability {
  type: string;
  value: number;
}

export interface MCPGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string; // ISO string
}

export interface MCPTransaction {
  id: string;
  date: string; // ISO string
  merchant: string;
  category: string;
  amount: number;
}

export interface MCP {
  assets: MCPAsset[];
  liabilities: MCPLiability[];
  goals: MCPGoal[];
  transactions: MCPTransaction[];
  insights?: string[];
} 