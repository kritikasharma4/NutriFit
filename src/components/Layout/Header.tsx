import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center cursor-pointer"
            >
              <div className="bg-blue-600 text-white p-1.5 rounded-md">
                <Activity className="w-6 h-6" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">NutriFit</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <div className="px-4 py-2">
            {user && (
              <div className="flex items-center space-x-2 py-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;