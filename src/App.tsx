import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ChatbotPage } from './pages/ChatbotPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { LocationsPage } from './pages/LocationsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab } = useNavigation();

  // If not logged in, show modern college-style AuthPage WITHOUT the main navigation bar
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Once authenticated, show consistent top navigation bar on all pages
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'chatbot' && <ChatbotPage />}
        {activeTab === 'map' && <CampusMapPage />}
        {activeTab === 'locations' && <LocationsPage />}
        {activeTab === 'subjects' && <SubjectsPage />}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* College Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">KIET CampusNav</span>
            <span>·</span>
            <span>Kakinada Institute of Engineering & Technology, Korangi</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Academic Project</span>
            <span>·</span>
            <span>Discrete Math · Algorithms · Java OOP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
