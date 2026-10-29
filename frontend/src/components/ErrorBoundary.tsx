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
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Something went wrong</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred in this view. No patient data has been saved or sent externally.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 font-mono text-left break-all">
            {errorMsg}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 text-white text-sm font-semibold rounded-xl hover:bg-brand-800 transition shadow-sm focus-visible-ring"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-xs focus-visible-ring"
          >
            <Home className="w-4 h-4 text-slate-500" />
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
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
