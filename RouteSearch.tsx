import React from 'react';
import { FavoriteFlight } from '../types';
import { Trash2, ExternalLink, Bookmark } from 'lucide-react';

interface FavoritesListProps {
  favorites: FavoriteFlight[];
  onSelect: (flightNo: string) => void;
  onRemove: (flightNo: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onSelect,
  onRemove
}) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col items-center justify-center min-h-[160px] text-center">
        <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          No Saved Flights Yet
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[280px]">
          Click the bookmark icon on any flight to save it here for fast status checks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
          <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/10" /> Saved Flights ({favorites.length})
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Access and instantly track your favorite ongoing/upcoming flights.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {favorites.map((flight) => (
          <div
            key={flight.flightNo}
            className="p-3.5 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 transition"
          >
            <div className="flex flex-col select-none">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                {flight.flightNo}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {flight.airlineName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {flight.origin} → {flight.destination}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => onSelect(flight.flightNo)}
                className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800/40 transition cursor-pointer active:scale-95"
                title="Track Flight"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(flight.flightNo)}
                className="p-2 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200/60 dark:border-slate-800/40 hover:border-rose-200/50 transition cursor-pointer active:scale-95"
                title="Remove Flight"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
