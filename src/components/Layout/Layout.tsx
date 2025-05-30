import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Activity, 
  User, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Food Logger', 
      path: '/food-logger', 
      icon: <UtensilsCrossed className="w-5 h-5" /> 
    },
    { 
      name: 'Fitness', 
      path: '/fitness-recommendations', 
      icon: <Activity className="w-5 h-5" /> 
    },
    { 
      name: 'Health Profile', 
      path: '/health-profile', 
      icon: <User className="w-5 h-5" /> 
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-4 flex flex-col h-full">
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
            </nav>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md w-full hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;