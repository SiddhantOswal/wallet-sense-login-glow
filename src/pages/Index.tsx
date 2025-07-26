import { useAuth } from '@/contexts/AuthContext';
import NucleusLogin from '@/components/WalletSenseLogin';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard onLogout={logout} />;
  }

  return <NucleusLogin />;
};

export default Index;
