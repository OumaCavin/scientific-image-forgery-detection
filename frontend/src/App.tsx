import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { AboutPage } from './pages/AboutPage';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
