import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RoadmapBuilder from './pages/RoadmapBuilder';
import RoadmapView from './pages/RoadmapView';
import { RoadmapProvider } from './context/RoadmapContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-700 font-medium">Loading Skill Roadmap Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RoadmapProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="builder" element={<RoadmapBuilder />} />
                <Route path="roadmap/:id" element={<RoadmapView />} />
              </Route>
            </Routes>
          </Router>
          <Toaster position="top-right" expand={true} richColors />
        </RoadmapProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;