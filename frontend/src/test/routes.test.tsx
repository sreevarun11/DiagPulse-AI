import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Terms } from '../pages/Terms';
import { DisclaimerPrivacy } from '../pages/DisclaimerPrivacy';
import { NotFound } from '../pages/NotFound';
import { Results } from '../pages/Results';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('Frontend Pages & Components Suite', () => {
  it('renders EmergencyBanner with critical clinical warning', () => {
    render(<EmergencyBanner />);
    expect(screen.getByRole('alert')).toHaveTextContent(/Emergency Warning/i);
    expect(screen.getByText(/severe, acute, or unstable symptoms/i)).toBeInTheDocument();
  });

  it('renders DisclaimerBanner with regulatory decision support note', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByRole('note')).toHaveTextContent(/decision-support prototype/i);
    expect(screen.getByText(/not a medical device/i)).toBeInTheDocument();
  });

  it('renders Home page with CTA and workflow steps', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Evidence-Based Differential Clinical Decision Support/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Launch Symptom Classifier/i })).toBeInTheDocument();
    expect(screen.getByText(/How DiagPulse AI Assists Consultation/i)).toBeInTheDocument();
  });

  it('renders Terms of Clinical Use page', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>
    );
    expect(screen.getByText(/Terms of Clinical Use/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinician Responsibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Disclaimer of Warranties/i)).toBeInTheDocument();
  });

  it('renders Disclaimer & Privacy page with zero-tracking disclosure', () => {
    render(
      <MemoryRouter>
        <DisclaimerPrivacy />
      </MemoryRouter>
    );
    expect(screen.getByText(/Clinical Disclaimer & Data Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Part II: Privacy by Design & Zero-Retention Architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Storage & No Persistent DB/i)).toBeInTheDocument();
    expect(screen.getByText(/Part III: Cookies and Local Storage Policy/i)).toBeInTheDocument();
  });

  it('renders Results fallback when accessed directly without symptoms', () => {
    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Active Clinical Evaluation Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Symptom Classifier/i })).toBeInTheDocument();
  });

  it('renders Custom 404 page for unknown routes', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText(/Clinical Route Not Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return to Overview/i })).toBeInTheDocument();
  });

  it('ErrorBoundary catches errors and presents friendly UI without stack traces', () => {
    // Component that intentionally throws
    const ProblemChild: React.FC = () => {
      throw new Error('Simulated testing failure');
    };

    // Suppress console.error in test output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Clinical Application Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Application/i)).toBeInTheDocument();
    // Verify stack trace is NOT exposed
    expect(screen.queryByText(/at ProblemChild/i)).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
