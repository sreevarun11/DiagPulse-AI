import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

// 8 Dedicated Required Pages
import { Home } from './pages/Home';
import { Classifier } from './pages/Classifier';
import { Results } from './pages/Results';
import { Performance } from './pages/Performance';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { DisclaimerPrivacy } from './pages/DisclaimerPrivacy';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/check-symptoms" element={<Classifier />} />
              <Route path="/classifier" element={<Classifier />} />
              <Route path="/results" element={<Results />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer-privacy" element={<DisclaimerPrivacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
