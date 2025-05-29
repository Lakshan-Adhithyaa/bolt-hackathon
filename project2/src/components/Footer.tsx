import { Heart, Github, Twitter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  
  return (
    <footer className={`border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {year} Skill Roadmap Builder. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for continuous learning
            </p>
            
            <div className="flex space-x-2">
              <a 
                href="#" 
                className="p-2 rounded-full text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;