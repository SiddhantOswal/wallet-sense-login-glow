import { useState } from 'react';
import WalletSenseLogin from '@/components/WalletSenseLogin';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return <WalletSenseLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
};

export default Index;
