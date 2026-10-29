import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export const ErrorBoundaryFallback: React.FC<{ onReset: () => void; errorMsg: string }> = ({ onReset, errorMsg }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50/70">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card border border-slate-200/80 p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Clinical Application Error</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            An unexpected runtime condition occurred. To preserve clinical state safety, the active view was suspended. No patient or symptom data was compromised.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-600 font-mono text-left break-all">
            {errorMsg}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition focus-visible-ring"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition focus-visible-ring"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Return to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected runtime error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Internal logging without exposing raw stack traces to the end user
    console.error('ErrorBoundary caught an error:', error.name, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback onReset={this.handleReset} errorMsg={this.state.errorMessage} />;
    }

    return this.props.children;
  }
}
