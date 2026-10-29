import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Stethoscope, 
  BarChart2, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Menu, 
  X, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { api } from '../api/client';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [featuresCount, setFeaturesCount] = useState<number>(174);
  const [classesCount, setClassesCount] = useState<number>(46);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const checkHealth = () => {
    api.getHealth()
      .then((data) => {
        setIsHealthy(data.status === 'healthy' && data.model_loaded);
        if (data.features_count) setFeaturesCount(data.features_count);
        if (data.classes_count) setClassesCount(data.classes_count);
      })
      .catch(() => {
        setIsHealthy(false);
      });
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Overview', icon: Activity },
    { to: '/classifier', label: 'Classifier', icon: Stethoscope },
    { to: '/performance', label: 'Benchmarks', icon: BarChart2 },
    { to: '/about', label: 'Methodology', icon: Info },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus-visible-ring rounded-lg p-1 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400 shadow-sm group-hover:bg-slate-800 transition-colors">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  Diag<span className="text-brand-700">Pulse</span> AI
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Clinical DSS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block -mt-0.5 tracking-normal">
                Multi-Symptom Decision Prototype
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all focus-visible-ring ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold shadow-subtle'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Status & Primary Action */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Model Health Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isHealthy === true
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                  : isHealthy === false
                  ? 'bg-rose-50 text-rose-800 border-rose-200/80 cursor-pointer'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={
                isHealthy === true 
                  ? `FastAPI server healthy (${classesCount} classes, ${featuresCount} symptoms loaded)`
                  : isHealthy === false 
                  ? 'Backend unavailable on 127.0.0.1:8000. Click to retry.'
                  : 'Checking backend status...'
              }
              onClick={isHealthy === false ? checkHealth : undefined}
            >
              {isHealthy === true ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>API Online</span>
                </>
              ) : isHealthy === false ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>API Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Checking...</span>
                </>
              )}
            </div>

            {/* Quick CTA */}
            {location.pathname !== '/classifier' && (
              <Link
                to="/classifier"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all focus-visible-ring"
              >
                <span>New Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible-ring"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-elevation animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500 font-medium">Backend Health:</span>
              <span className={`font-semibold ${isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isHealthy ? 'Online (8000)' : 'Offline'}
              </span>
            </div>

            <Link
              to="/classifier"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Stethoscope className="w-4 h-4 text-brand-400" />
              <span>Launch Clinical Classifier</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
