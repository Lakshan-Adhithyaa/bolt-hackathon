import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { GroovyNavbar } from './components/layout/GroovyNavbar';
import { ToastContainer } from './components/ui/Toast';
import { SupabaseStatus } from './components/ui/SupabaseStatus';
import { BeamsBackground } from './components/ui/BeamsBackground';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Skills } from './pages/Skills';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { Premium } from './pages/Premium';
import { MyRoadmaps } from './pages/MyRoadmaps';
import { CreateRoadmap } from './pages/CreateRoadmap';
import { RoadmapView } from './pages/RoadmapView';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <GroovyNavbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={
              <BeamsBackground>
                <Landing />
              </BeamsBackground>
            } />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <BeamsBackground className="glass">
                    <Login />
                  </BeamsBackground>
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <BeamsBackground className="glass">
                    <Signup />
                  </BeamsBackground>
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skills" 
              element={
                <ProtectedRoute>
                  <Skills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-roadmap" 
              element={
                <ProtectedRoute>
                  <CreateRoadmap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roadmap/:id" 
              element={
                <ProtectedRoute>
                  <RoadmapView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/premium" 
              element={
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roadmaps" 
              element={
                <ProtectedRoute>
                  <MyRoadmaps />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SupabaseStatus />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;