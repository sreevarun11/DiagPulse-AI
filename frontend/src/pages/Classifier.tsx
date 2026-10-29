import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Stethoscope, 
  Filter, 
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Layers,
  Activity
} from 'lucide-react';
import { api, ApiError } from '../api/client';
import { SymptomItem, SymptomsResponse } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Classifier: React.FC = () => {
  const navigate = useNavigate();
  const [symptomsData, setSymptomsData] = useState<SymptomsResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Load symptoms dynamically from backend
  const loadSymptoms = () => {
    setIsLoadingSymptoms(true);
    setErrorMessage(null);
    setIsOffline(false);

    api.getSymptoms()
      .then((data) => {
        setSymptomsData(data);
        setIsLoadingSymptoms(false);
      })
      .catch((err) => {
        setIsLoadingSymptoms(false);
        setIsOffline(true);
        setErrorMessage(
          err.message || 'Diagnostic backend is unreachable. Please verify FastAPI is running on http://127.0.0.1:8000.'
        );
      });
  };

  useEffect(() => {
    loadSymptoms();
  }, []);

  // Filter symptoms based on search and selected organ system category
  const filteredSymptoms = useMemo(() => {
    if (!symptomsData) return [];
    return symptomsData.symptoms.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [symptomsData, searchQuery, selectedCategory]);

  // Selected item objects for quick chip summary
  const selectedItems = useMemo(() => {
    if (!symptomsData) return [];
    const lookup = new Map<string, SymptomItem>(symptomsData.symptoms.map(s => [s.id, s]));
    return selectedIds.map(id => lookup.get(id)).filter((item): item is SymptomItem => item !== undefined);
  }, [symptomsData, selectedIds]);

  const toggleSymptom = (id: string) => {
    setErrorMessage(null);
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

  const handleReset = () => {
    setSelectedIds([]);
    setErrorMessage(null);
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setErrorMessage('Please select at least 1 symptom to perform clinical evaluation.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.predict(selectedIds);
      // Navigate to results page with prediction response and selected symptom details
      navigate('/results', {
        state: {
          predictionData: response,
          selectedSymptoms: selectedItems,
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Diagnostic inference failed. Please check backend connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Clinical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-brand-700" />
            <span>Interactive Clinical Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Stethoscope className="w-7 h-7 text-slate-900" aria-hidden="true" />
            <span>Outpatient Symptom Classifier</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Record patient-reported signs from the verified 174-feature dictionary. The engine computes ranked differential hypotheses with exact linear attribution.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition shadow-subtle self-start md:self-center focus-visible-ring"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Selection ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Advisory Banner */}
      <DisclaimerBanner compact />

      {/* Error Alert / Offline State */}
      {errorMessage && (
        <div 
          className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-4 text-xs sm:text-sm text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle" 
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-900">Communication Error</h4>
              <p className="text-rose-800 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
          {isOffline && (
            <button
              type="button"
              onClick={loadSymptoms}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Backend</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Active Selection Summary Cockpit */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span>Reported Patient Presentation</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold font-mono">
              {selectedIds.length} / 50 Selected
            </span>
          </div>

          {/* Presentation Sufficiency Status */}
          <div>
            {selectedIds.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium">No symptoms selected</span>
            ) : selectedIds.length === 1 ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full font-medium">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>1 symptom: Will trigger safety abstention (min. 2 recommended)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Presentation sufficiency satisfied</span>
              </span>
            )}
          </div>
        </div>

        {/* Selected Chips */}
        {selectedIds.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs sm:text-sm space-y-1">
            <p className="font-medium text-slate-500">Presentation is currently empty</p>
            <p className="text-slate-400">Search symptoms below or select by bodily system to begin evaluation.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors shadow-subtle group"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({item.category.split(' ')[0]})</span>
                <button
                  type="button"
                  onClick={() => toggleSymptom(item.id)}
                  className="text-slate-400 hover:text-rose-600 focus-visible-ring rounded-md p-0.5 transition-colors ml-0.5"
                  title={`Remove ${item.name}`}
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Main Symptom Picker Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Category Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card space-y-2 sticky top-20">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> 
              <span>Organ Systems</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {symptomsData?.categories.length || 8} groups
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between focus-visible-ring ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <span>All Systems</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                selectedCategory === 'All' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {symptomsData?.total_count || 174}
              </span>
            </button>

            {symptomsData?.categories.map((cat) => {
              const count = symptomsData.symptoms.filter(s => s.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between focus-visible-ring ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="truncate pr-1">{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono flex-shrink-0 ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms Grid & Search */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symptoms by name (e.g., cough, chest pain, wheezing, fatigue, jaundice)..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus-visible-ring placeholder:text-slate-400 shadow-card transition-all"
              aria-label="Search symptoms"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Filter Indicators */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
              <span>Showing:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200/70 text-slate-800 rounded-md font-medium text-[11px]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200/70 text-slate-800 rounded-md font-medium text-[11px]">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                </span>
              )}
              <span className="ml-auto font-mono text-[11px] text-slate-400">
                {filteredSymptoms.length} matches
              </span>
            </div>
          )}

          {/* Symptom Cards Grid */}
          {isLoadingSymptoms ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 text-xs sm:text-sm shadow-card space-y-3">
              <div className="animate-spin w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full mx-auto" />
              <p className="font-medium text-slate-700">Loading verified 174-symptom feature schema from API...</p>
              <p className="text-xs text-slate-400">Connecting to FastAPI on http://127.0.0.1:8000</p>
            </div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 text-xs sm:text-sm shadow-card space-y-3">
              <p className="font-semibold text-slate-700">No symptoms match "{searchQuery}" in {selectedCategory}.</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or reset category filter.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredSymptoms.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSymptom(item.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-xs flex items-start justify-between gap-2.5 focus-visible-ring group ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-card'
                        : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 hover:bg-slate-50/70 shadow-subtle'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="block leading-snug font-medium">{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] block ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                          {item.category}
                        </span>
                        {item.is_rare && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                            isSelected ? 'bg-amber-900/80 text-amber-200' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                            Rare
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected 
                          ? 'bg-brand-500 border-brand-500 text-slate-950 font-bold' 
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Submission Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <span>
                <strong className="text-slate-900 font-semibold">{selectedIds.length}</strong> patient signs selected for differential analysis.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0 || isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-card focus-visible-ring group"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Evaluating Clinical Likelihoods...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
                  <span>Generate Differential Diagnosis</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
