import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import type { MCP } from '../../types/mcp';

interface MCPContextValue {
  mcp: MCP | null;
  setMCP: Dispatch<SetStateAction<MCP | null>>;
}

const MCPContext = createContext<MCPContextValue | undefined>(undefined);

export const MCPProvider = ({ children }: { children: ReactNode }) => {
  const [mcp, setMCP] = useState<MCP | null>(null);

  return (
    <MCPContext.Provider value={{ mcp, setMCP }}>
      {children}
    </MCPContext.Provider>
  );
};

export function useMCP(): MCPContextValue {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCP must be used within an MCPProvider');
  }
  return context;
} 