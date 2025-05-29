import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const headerClass = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white bg-opacity-90 backdrop-blur-sm shadow-md dark:bg-slate-900 dark:bg-opacity-90'
      : 'bg-transparent'
  }`;
  
  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
          onClick={closeMenu}
        >
          <BookOpen className="h-7 w-7" />
          <span className="text-lg md:text-xl font-bold">Skill Roadmap</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                location.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/builder" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                location.pathname === '/builder' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Create Roadmap
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleTheme}
            className="p-2 mr-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium py-2 px-4 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                location.pathname === '/' ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/builder" 
              className={`text-sm font-medium py-2 px-4 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                location.pathname === '/builder' ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              onClick={closeMenu}
            >
              Create Roadmap
            </Link>
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="text-sm font-medium py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
