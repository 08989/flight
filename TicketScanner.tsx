import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, Bookmark } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (flightNo: string) => void;
  isLoading: boolean;
  recents: string[];
  onSelectRecent: (flightNo: string) => void;
}

const POPULAR_FLIGHTS = ['AA100', 'UA440', 'DL123', 'BA1104', 'EK215', 'SQ321'];

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  isLoading,
  recents,
  onSelectRecent
}) => {
  const [flightNo, setFlightNo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = flightNo.toUpperCase().replace(/\s+/g, '').trim();

    // Check if the input format matches two/three letters followed by numbers
    const validPattern = /^[A-Z0-9]{2,3}\d{1,4}$/;
    if (!validPattern.test(cleanInput)) {
      setError('Please enter a valid IATA flight number (e.g., AA121, UA440, DL22).');
      return;
    }

    setError('');
    onSearch(cleanInput);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl transition duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Flight Status & Delay Analytics
            <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Real-time
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Check the actual status and calculate a comprehensive predicted delay percentage.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. AA123, DL424, EK215"
              value={flightNo}
              onChange={(e) => {
                setFlightNo(e.target.value);
                setError('');
              }}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 pl-11 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition"
            />
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !flightNo.trim()}
            className="h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isLoading ? 'Analyzing...' : 'Predict & Search'}
          </button>
        </div>

        {error && <span className="text-sm font-medium text-rose-500">{error}</span>}
      </form>

      {/* Recommended Examples */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Examples:</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_FLIGHTS.map((pop) => (
            <button
              key={pop}
              onClick={() => {
                setFlightNo(pop);
                setError('');
                onSearch(pop);
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40 font-medium active:scale-95 transition cursor-pointer"
            >
              {pop}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recents.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-2">
            <Bookmark className="w-3.5 h-3.5" /> Recent Searches:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recents.map((item) => (
              <button
                key={item}
                onClick={() => onSelectRecent(item)}
                className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-100/30 dark:border-blue-900/30 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
