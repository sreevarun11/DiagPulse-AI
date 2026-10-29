import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  AlertCircle, 
  RotateCcw, 
  Check, 
  Stethoscope, 
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  HelpCircle,
  FlaskConical
} from 'lucide-react';
import { api } from '../api/client';
import { SymptomItem, SymptomsResponse } from '../types';

// Predefined documented demo cases using verified feature IDs
const DEMO_CASES = [
  {
    name: 'Respiratory Presentation (Asthma / Bronchitis)',
    symptoms: ['symptom_cough', 'symptom_wheezing', 'symptom_shortness_of_breath'],
  },
  {
    name: 'Febrile Presentation (Viral Syndrome)',
    symptoms: ['symptom_fever', 'symptom_headache', 'symptom_fatigue', 'symptom_sore_throat'],
  }
];

// Common shortcut symptoms (must match exact verified feature IDs)
const COMMON_SHORTCUTS = [
  { id: 'symptom_fever', label: 'Fever' },
  { id: 'symptom_cough', label: 'Cough' },
  { id: 'symptom_fatigue', label: 'Fatigue' },
  { id: 'symptom_shortness_of_breath', label: 'Shortness of Breath' },
  { id: 'symptom_headache', label: 'Headache' },
  { id: 'symptom_chest_pain', label: 'Chest Pain' },
  { id: 'symptom_sore_throat', label: 'Sore Throat' },
  { id: 'symptom_wheezing', label: 'Wheezing' },
];

export const Classifier: React.FC = () => {
  const navigate = useNavigate();
  const [symptomsData, setSymptomsData] = useState<SymptomsResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isColdStarting, setIsColdStarting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoCaseName, setDemoCaseName] = useState<string>('');

  const loadSymptoms = () => {
    setIsLoadingSymptoms(true);
    setErrorMessage(null);

    // Detect potential cold-start if request takes longer than 3 seconds
    const coldTimer = setTimeout(() => {
      setIsColdStarting(true);
    }, 3000);

    api.getSymptoms()
      .then((data) => {
        clearTimeout(coldTimer);
        setIsColdStarting(false);
        setSymptomsData(data);
        setIsLoadingSymptoms(false);
      })
      .catch((err) => {
        clearTimeout(coldTimer);
        setIsColdStarting(false);
        setIsLoadingSymptoms(false);
        setErrorMessage(
          err.message || 'The diagnostic service is currently unavailable. Please check that the server is running.'
        );
      });
  };

  useEffect(() => {
    loadSymptoms();
  }, []);

  // Filter symptoms based on search and selected category
  const filteredSymptoms = useMemo(() => {
    if (!symptomsData) return [];
    return symptomsData.symptoms.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [symptomsData, searchQuery, selectedCategory]);

  // Selected item objects for summary
  const selectedItems = useMemo(() => {
    if (!symptomsData) return [];
    const lookup = new Map<string, SymptomItem>(symptomsData.symptoms.map(s => [s.id, s]));
    return selectedIds.map(id => lookup.get(id)).filter((item): item is SymptomItem => item !== undefined);
  }, [symptomsData, selectedIds]);

  const toggleSymptom = (id: string) => {
    setErrorMessage(null);
    setIsDemoActive(false);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 50) {
        setErrorMessage('Maximum clinical safety limit: 50 symptoms per assessment.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedIds([]);
    setErrorMessage(null);
    setIsDemoActive(false);
    setDemoCaseName('');
  };

  const handleApplyDemoCase = (index: number = 0) => {
    const demo = DEMO_CASES[index];
    setSelectedIds([...demo.symptoms]);
    setIsDemoActive(true);
    setDemoCaseName(demo.name);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.predict(selectedIds);
      navigate('/results', {
        state: {
          predictionData: response,
          selectedSymptoms: selectedItems,
          isSampleCase: isDemoActive,
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Diagnostic assessment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Title & Instructions */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Stethoscope className="w-8 h-8 text-brand-700" aria-hidden="true" />
          <span>Check Symptoms</span>
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Select reported patient signs to generate ranked differential possibilities with transparent model explanations.
        </p>
      </div>

      {/* Cold Start Notice */}
      {isColdStarting && (
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-sm flex items-start gap-3">
          <div className="animate-spin w-4 h-4 border-2 border-sky-700 border-t-transparent rounded-full mt-0.5" />
          <div>
            <p className="font-semibold">The server is starting up.</p>
            <p className="text-xs text-sky-800 mt-0.5">This may take a moment on initial launch. Please wait while the model initializes.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Assessment Notice</p>
              <p className="text-xs text-rose-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSymptoms}
            className="text-xs font-semibold px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-rose-800 hover:bg-rose-100 transition flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Two-Column Main Layout: Picker (Left) & Sticky Summary Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Symptom Selector (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* 1. Common Symptoms Shortcuts Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Common Shortcuts
              </span>
              <span className="text-xs text-slate-400">Quick selection shortcuts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SHORTCUTS.map((shortcut) => {
                const isSelected = selectedIds.includes(shortcut.id);
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => toggleSymptom(shortcut.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition focus-visible-ring flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-700 border-brand-700 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{shortcut.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Search & Category Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 174 symptoms (e.g. cough, fever, chest pain)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus-visible-ring placeholder:text-slate-400 shadow-sm"
                aria-label="Search symptoms"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition focus-visible-ring ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({symptomsData?.total_count || 174})
              </button>
              {symptomsData?.categories.map((cat) => {
                const count = symptomsData.symptoms.filter(s => s.category === cat).length;
                const isCurrent = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition focus-visible-ring ${
                      isCurrent
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Symptom Grid (Large Clickable Tiles) */}
          {isLoadingSymptoms ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <div className="animate-spin w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm">Loading verified 174-symptom catalog...</p>
            </div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">No symptoms match "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try checking your spelling or clear category filters to explore the full catalog.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs font-semibold text-brand-700 hover:underline pt-1 inline-block"
              >
                Reset search & filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredSymptoms.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSymptom(item.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-sm flex items-center justify-between gap-3 focus-visible-ring ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    role="checkbox"
                    aria-checked={isSelected}
                  >
                    <span className="font-medium leading-snug">{item.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition ${
                        isSelected
                          ? 'bg-brand-500 border-brand-500 text-slate-950'
                          : 'border-slate-300'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sticky "Your Symptoms" Panel (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Your Symptoms</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                  {selectedIds.length}
                </span>
              </div>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-rose-600 transition font-medium focus-visible-ring"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Try a Sample Case Trigger */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Need a quick demonstration?</span>
                <span className="text-slate-500 text-[11px]">Load verified demo presentation data</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyDemoCase(0)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-brand-700 hover:bg-slate-100 transition shadow-xs flex-shrink-0 focus-visible-ring"
              >
                Try sample case
              </button>
            </div>

            {/* Sample Case Active Banner */}
            {isDemoActive && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold block">Sample Case / Demo Data Active</span>
                  <span className="text-[11px] text-amber-800">{demoCaseName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-amber-700 hover:text-amber-950 text-[11px] font-semibold underline"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Selected Symptoms Chips List */}
            {selectedIds.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm space-y-1">
                <p className="font-medium text-slate-600">No symptoms selected</p>
                <p className="text-xs text-slate-400">Click symptoms on the left or try the sample case above.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSymptom(item.id)}
                        className="text-slate-400 hover:text-rose-600 focus-visible-ring rounded p-0.5 ml-0.5"
                        title={`Remove ${item.name}`}
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Guidance / Hint */}
            <div className="pt-2">
              {selectedIds.length < 3 ? (
                <p className="text-xs text-slate-500 leading-normal flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Select at least 3 symptoms for a more informative assessment.</span>
                </p>
              ) : (
                <p className="text-xs text-emerald-700 leading-normal flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{selectedIds.length} symptoms selected — ready for evaluation.</span>
                </p>
              )}
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0 || isSubmitting}
              className="w-full py-3 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2 text-sm focus-visible-ring"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Analyzing presentation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate results</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Concise Safety Disclaimer Near Action */}
            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Suggestions are informational decision-support hypotheses, not clinical diagnoses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
