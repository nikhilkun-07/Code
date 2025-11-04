import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Pizza, Menu, X, User, LogOut, Shield, ShoppingCart } from "lucide-react";
import Cart from "./Cart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClasses = (path) =>
    `relative px-2 py-1 transition-colors duration-200 ${
      isActive(path)
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  const underlineClasses = (path) =>
    `absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 ${
      isActive(path) ? "w-full" : "w-0 group-hover:w-full"
    }`;

  const links = [
    { name: "Home", path: "/" },
    ...(user
      ? user.role === "admin"
        ? [
            { 
              name: "Admin", 
              path: "/admin",
              icon: <Shield className="h-4 w-4 mr-1" />
            }
          ]
        : [
            { name: "Menu", path: "/dashboard" },
            { name: "Build Pizza", path: "/build-pizza" },
            { name: "My Orders", path: "/orders" },
          ]
      : [
          { name: "Login", path: "/login" },
          { name: "Sign Up", path: "/register", isButton: true },
        ]),
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-blue-600">
              <Pizza className="h-8 w-8" />
              <span className="font-bold text-xl tracking-wide">
                PizzaDeliver
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {links.map((link) => (
                <div key={link.name} className="group relative">
                  <Link
                    to={link.path}
                    className={
                      link.isButton
                        ? "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        : navLinkClasses(link.path) + " flex items-center"
                    }
                  >
                    {link.icon && link.icon}
                    {link.name}
                  </Link>
                  {!link.isButton && <span className={underlineClasses(link.path)} />}
                </div>
              ))}

              {user && user.role !== "admin" && (
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              {user && (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 md:hidden">
              {user && user.role !== "admin" && (
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="relative p-2 text-gray-700 hover:text-blue-600"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 space-y-4">
              {links.map((link) => (
                <div key={link.name} className="group relative">
                  <Link
                    to={link.path}
                    className={
                      link.isButton
                        ? "block text-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                        : navLinkClasses(link.path) + " flex items-center"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && link.icon}
                    {link.name}
                  </Link>
                  {!link.isButton && <span className={underlineClasses(link.path)} />}
                </div>
              ))}

              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;