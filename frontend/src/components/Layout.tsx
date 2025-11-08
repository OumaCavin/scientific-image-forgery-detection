import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Menu, 
  X, 
  Upload, 
  BarChart3, 
  FileImage, 
  Info,
  Github,
  ExternalLink
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: Brain },
  { name: 'Analyze Images', href: '/analyze', icon: Upload },
  { name: 'Results', href: '/results', icon: FileImage },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'About', href: '/about', icon: Info },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Scientific Forgery Detection
                </h1>
                <p className="text-xs text-slate-500">
                  by Cavin Otieno
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Competition Info & GitHub */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Recod.ai/LUC Competition</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/OumaCavin/scientific-image-forgery-detection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200"
            >
              <div className="px-4 py-6 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Links */}
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
                  <a
                    href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Competition</span>
                  </a>
                  <a
                    href="https://github.com/OumaCavin/scientific-image-forgery-detection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Scientific Forgery Detection</h3>
                  <p className="text-sm text-slate-500">by Cavin Otieno</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Advanced AI-powered system for detecting copy-move forgeries in biomedical research images.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Competition</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a 
                    href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Recod.ai/LUC Competition
                  </a>
                </li>
                <li>Objective: Identify duplicated regions</li>
                <li>Prize Pool: $55,000</li>
                <li>Focus: Biomedical research imaging</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Deep Learning & CNN</li>
                <li>Computer Vision</li>
                <li>React & TypeScript</li>
                <li>Python & FastAPI</li>
                <li>Supabase Database</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-slate-500">
                © 2025 Cavin Otieno. Built for the Recod.ai/LUC Scientific Image Forgery Detection Competition.
              </p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <a
                  href="https://github.com/OumaCavin/scientific-image-forgery-detection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  View on GitHub
                </a>
                <span className="text-sm text-slate-500">
                  Version 1.0.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
