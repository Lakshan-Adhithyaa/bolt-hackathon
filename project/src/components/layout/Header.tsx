import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, User, LogOut, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TokenCounter } from '../ui/TokenCounter';
import { StreakCounter } from '../ui/StreakCounter';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Learner Source
            </span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/roadmaps"
                className={`text-sm font-medium transition-colors ${
                  isActive('/roadmaps') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                My Roadmaps
              </Link>
              <Link
                to="/skills"
                className={`text-sm font-medium transition-colors ${
                  isActive('/skills') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Skills
              </Link>
              <Link
                to="/achievements"
                className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive('/achievements') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Achievements</span>
              </Link>
              <Link
                to="/premium"
                className={`text-sm font-medium transition-colors ${
                  isActive('/premium') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Premium
              </Link>
            </nav>
          )}

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <TokenCounter tokens={user.tokens} />
                <StreakCounter streak={user.streak} />
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/achievements"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Trophy className="w-4 h-4" />
                        <span>Achievements</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};