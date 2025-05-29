import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;