import React, { useState } from 'react';
import { FlightData } from '../types';
import { generateMockFlightData } from '../utils/flightPredictor';
import { MapPin, Sparkles, Navigation, Globe, ArrowRight } from 'lucide-react';

interface RouteSearchProps {
  onSelectFlight: (flightNo: string) => void;
}

// Preset worldwide routes for direct exploration
const POPULAR_ROUTES = [
  { from: 'Washington', to: 'Texas', display: 'Washington → Texas' },
  { from: 'London', to: 'New York', display: 'London → New York' },
  { from: 'Dubai', to: 'Singapore', display: 'Dubai → Singapore' },
  { from: 'Tokyo', to: 'Los Angeles', display: 'Tokyo → Los Angeles' },
  { from: 'Paris', to: 'Rome', display: 'Paris → Rome' }
];

const ROUTE_AIRLINES = ['AA', 'DL', 'UA', 'BA', 'EK', 'AF', 'SQ', 'WN'];

export const RouteSearch: React.FC<RouteSearchProps> = ({ onSelectFlight }) => {
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [results, setResults] = useState<FlightData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedText, setSearchedText] = useState('');

  const generateFlightsForRoute = (fromLocation: string, toLocation: string) => {
    // Generate pseudo-deterministic flights based on source and dest to be consistent yet interesting.
    const flights: FlightData[] = [];
    const fromN = fromLocation.trim().toUpperCase();
    const toN = toLocation.trim().toUpperCase();
    
    // Create 3-5 randomized matching mock flights going from that source to that destination
    const count = 4;
    for (let i = 0; i < count; i++) {
      const code = `${ROUTE_AIRLINES[(fromN.charCodeAt(0) + i) % ROUTE_AIRLINES.length]}${100 + (toN.charCodeAt(0) * (i + 1)) % 899}`;
      const f = generateMockFlightData(code);

      // Overwrite airport locations to align with route perfectly
      f.origin.airport = `${fromLocation} International Airport`;
      f.origin.iata = fromN.substring(0, 3);
      f.destination.airport = `${toLocation} International Airport`;
      f.destination.iata = toN.substring(0, 3);

      flights.push(f);
    }
    return flights;
  };

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !dest.trim()) return;

    setIsSearching(true);
    setSearchedText(`${source} → ${dest}`);
    setTimeout(() => {
      const generated = generateFlightsForRoute(source, dest);
      setResults(generated);
      setIsSearching(false);
    }, 700);
  };

  const selectPresetRoute = (from: string, to: string) => {
    setSource(from);
    setDest(to);
    setIsSearching(true);
    setSearchedText(`${from} → ${to}`);
    setTimeout(() => {
      const generated = generateFlightsForRoute(from, to);
      setResults(generated);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl transition duration-300 flex flex-col justify-between select-none">
      <div className="flex items-center gap-3 mb-4 select-none">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
            Route Search Engine
            <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Worldwide
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 select-none">
            Find active and scheduled flights between any two locations or hubs around the globe.
          </p>
        </div>
      </div>

      <form onSubmit={handleRouteSearch} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Departure Location (e.g. Washington)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 pl-11 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition"
              required
            />
            <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Arrival Location (e.g. Texas)"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 pl-11 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition"
              required
            />
            <Navigation className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none transform rotate-90" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !source.trim() || !dest.trim()}
          className="h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl px-6 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 active:scale-[0.98] transition cursor-pointer"
        >
          {isSearching ? 'Fetching Global Flights...' : 'Explore Route Flights'}
        </button>
      </form>

      {/* Recommended worldwide Preset routes */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm select-none">
        <span className="text-slate-500 dark:text-slate-400 font-bold">Suggested:</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ROUTES.map((route, i) => (
            <button
              key={i}
              onClick={() => selectPresetRoute(route.from, route.to)}
              className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40 font-medium active:scale-95 transition cursor-pointer select-none"
            >
              {route.display}
            </button>
          ))}
        </div>
      </div>

      {/* Search results rendering */}
      {results.length > 0 && (
        <div className="mt-5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex flex-col gap-3 animate-fade-in select-none">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Route Matches For: <b>{searchedText}</b></span>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide">
              {results.length} Available Flights
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.map((f) => (
              <div
                key={f.flightNo}
                onClick={() => onSelectFlight(f.flightNo)}
                className="p-4 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between gap-4 transition cursor-pointer select-none hover:shadow-md"
              >
                <div className="flex flex-col select-none">
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-wide">
                    {f.flightNo}
                  </span>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {f.airlineName}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {f.origin.airport} → {f.destination.airport}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 px-2.5 py-1.5 rounded-xl border border-blue-100/40 dark:border-blue-900/40 select-none cursor-pointer flex-shrink-0">
                  Assess Risk <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
