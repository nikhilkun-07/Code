import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pizza, 
  Package, 
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/pizzas', icon: Pizza, label: 'Pizza Management' },
    { path: '/admin/ingredients', icon: Package, label: 'Ingredients' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-20 right-4 z-50 scrollbar-hide">
        <button
          onClick={toggleMobileMenu}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={`
        fixed lg:sticky top-0 right-0 h-screen z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-white shadow-lg border-l border-gray-200
      `}>
        
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800 truncate">
              Admin Panel
            </h1>
          )}
          
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center rounded-lg transition-all duration-200
                      ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3 space-x-3'}
                      ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                    {!isCollapsed && (
                      <span className="font-medium truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`
          absolute bottom-4 left-4 right-4
          ${isCollapsed ? 'flex justify-center' : ''}
        `}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center rounded-lg transition-colors w-full
              ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3 space-x-3'}
              text-gray-600 hover:bg-gray-100 hover:text-gray-900
            `}
          >
            <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
            {!isCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0  bg-opacity-30 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;