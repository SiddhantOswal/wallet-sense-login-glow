import { useState } from 'react';
import NucleusLogin from '@/components/WalletSenseLogin';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  return <NucleusLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
};

export default Index;
