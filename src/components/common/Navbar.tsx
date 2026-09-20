import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import {
  Users,
  Compass,
  PlusCircle,
  FolderGit2,
  Bell,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-indigo-400 font-bold text-xl tracking-tight hover:text-indigo-300 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-white font-extrabold tracking-normal">
              Team<span className="text-indigo-400">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/explore"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/explore')
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Projects
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/create-project"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/create-project')
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Project
                </Link>

                <Link
                  to="/my-projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/my-projects')
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  My Projects
                </Link>

                <Link
                  to="/requests"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/requests')
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Requests
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                        : 'text-rose-400 hover:bg-rose-950/30'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/60 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Projects
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-project"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Create Project
              </Link>
              <Link
                to="/my-projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Projects
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Requests
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Profile ({user?.name})
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-md text-slate-200 hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-md bg-indigo-600 text-white font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
