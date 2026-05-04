import React from 'react';
import { FlightData } from '../types';
import { Plane, Clock, ShieldCheck, MapPin, AlertCircle, Bookmark, BookmarkCheck, Thermometer, Wind } from 'lucide-react';

interface FlightOverviewProps {
  flight: FlightData;
  isFavorite: boolean;
  onToggleFavorite: (f: FlightData) => void;
}

export const FlightOverview: React.FC<FlightOverviewProps> = ({
  flight,
  isFavorite,
  onToggleFavorite
}) => {
  const getStatusColor = (status: FlightData['flightStatus']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500 text-white';
      case 'scheduled': return 'bg-sky-500 text-white';
      case 'landed': return 'bg-slate-500 text-white';
      case 'cancelled': return 'bg-rose-500 text-white';
      default: return 'bg-amber-500 text-white';
    }
  };

  const getStatusText = (status: FlightData['flightStatus']) => {
    switch (status) {
      case 'active': return 'In Air';
      case 'scheduled': return 'Scheduled';
      case 'landed': return 'Landed';
      case 'cancelled': return 'Cancelled';
      default: return status.toUpperCase();
    }
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-500' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-500' };
    return { label: 'Unhealthy', color: 'text-rose-500' };
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between">
      {/* Top Banner section */}
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md shadow-blue-500/20">
            {flight.airlineIata}
          </div>
          <div>
            <span className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              {flight.flightNo}
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-2">
              {flight.airlineName}
            </h3>
            {flight.aircraft && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Equipment: {flight.aircraft.model}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-black tracking-wide uppercase px-3 py-1.5 rounded-full shadow-sm ${getStatusColor(flight.flightStatus)}`}>
            {getStatusText(flight.flightStatus)}
          </span>
          <button
            onClick={() => onToggleFavorite(flight)}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer active:scale-95 ${
              isFavorite
                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50 text-amber-500'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50 text-slate-400 hover:text-amber-500'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Add to saved'}
          >
            {isFavorite ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main airports grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-6">
        {/* Origin */}
        <div className="md:col-span-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {flight.origin.iata}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md">
                Departure
              </span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              {flight.origin.airport}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 border-t border-slate-200/40 dark:border-slate-800/40 pt-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Scheduled:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(flight.origin.scheduled).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {flight.origin.estimated && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Estimated:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {new Date(flight.origin.estimated).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            <div className="flex gap-2 mt-1 border-t border-slate-100 dark:border-slate-800 pt-1.5 justify-between">
              {flight.origin.terminal && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                  Term: <b className="text-slate-800 dark:text-slate-200">{flight.origin.terminal}</b>
                </span>
              )}
              {flight.origin.gate && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                  Gate: <b className="text-slate-800 dark:text-slate-200">{flight.origin.gate}</b>
                </span>
              )}
            </div>

            {/* Weather & AQI Additions for Origin */}
            {flight.origin.temp !== undefined && (
              <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-2 mt-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Thermometer className="w-3.5 h-3.5" /> Temp & Sky:
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {flight.origin.temp}°C · {flight.origin.weather}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Wind className="w-3.5 h-3.5" /> AQI Level:
                  </span>
                  <span className={`font-bold ${getAQILevel(flight.origin.aqi || 40).color}`}>
                    {flight.origin.aqi} AQI ({getAQILevel(flight.origin.aqi || 40).label})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Route Connection Visualizer */}
        <div className="md:col-span-1 flex flex-col items-center justify-center h-full gap-1 min-h-[60px] md:min-h-0">
          <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
            NON-STOP
          </div>
          <div className="relative w-full max-w-[120px] h-4 flex items-center justify-center">
            <div className="absolute top-2 w-full h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
            <Plane className="absolute text-blue-600 dark:text-blue-400 w-5 h-5 bg-white dark:bg-slate-900 rounded-full animate-pulse transform rotate-90" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Route Path</span>
        </div>

        {/* Destination */}
        <div className="md:col-span-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {flight.destination.iata}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md">
                Arrival
              </span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              {flight.destination.airport}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200/40 dark:border-slate-800/40 pt-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Scheduled:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(flight.destination.scheduled).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {flight.destination.estimated && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Estimated:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {new Date(flight.destination.estimated).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            <div className="flex gap-2 mt-1 border-t border-slate-100 dark:border-slate-800 pt-1.5 justify-between">
              {flight.destination.terminal && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                  Term: <b className="text-slate-800 dark:text-slate-200">{flight.destination.terminal}</b>
                </span>
              )}
              {flight.destination.gate && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                  Gate: <b className="text-slate-800 dark:text-slate-200">{flight.destination.gate}</b>
                </span>
              )}
            </div>

            {/* Weather & AQI Additions for Destination */}
            {flight.destination.temp !== undefined && (
              <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-2 mt-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Thermometer className="w-3.5 h-3.5" /> Temp & Sky:
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {flight.destination.temp}°C · {flight.destination.weather}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Wind className="w-3.5 h-3.5" /> AQI Level:
                  </span>
                  <span className={`font-bold ${getAQILevel(flight.destination.aqi || 40).color}`}>
                    {flight.destination.aqi} AQI ({getAQILevel(flight.destination.aqi || 40).label})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG-based Route Connection Visualization */}
      <div className="relative mb-4 bg-slate-50/40 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center select-none">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 select-none flex items-center gap-1.5">
          <Plane className="w-3.5 h-3.5" /> Direct Flight Trajectory Map
        </h4>
        <div className="relative w-full max-w-[420px] h-20 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-100/60 dark:border-slate-800/60 flex items-center justify-center p-2 select-none">
          <svg className="w-full h-full" viewBox="0 0 320 80">
            <defs>
              <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Draw curve path */}
            <path
              d="M 30,50 Q 160,5 290,50"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-40"
            />
            {/* Animated blue plane line */}
            <path
              d="M 30,50 Q 160,5 290,50"
              fill="none"
              stroke="url(#planeGrad)"
              strokeWidth="2.5"
              strokeDasharray="320"
              strokeDashoffset="320"
              className="animate-[dash_2.5s_ease-in-out_infinite]"
            />
            {/* Points for hubs */}
            <circle cx="30" cy="50" r="4.5" fill="#3b82f6" className="animate-pulse" />
            <circle cx="290" cy="50" r="4.5" fill="#8b5cf6" />
            
            {/* Label texts */}
            <text x="30" y="68" fontSize="10" fill="#64748b" textAnchor="middle" className="font-black tracking-wider">{flight.origin.iata}</text>
            <text x="290" y="68" fontSize="10" fill="#64748b" textAnchor="middle" className="font-black tracking-wider">{flight.destination.iata}</text>
            <text x="160" y="32" fontSize="9" fill="#3b82f6" textAnchor="middle" className="font-bold tracking-tight">Active In Air Path</text>
          </svg>
        </div>
      </div>

      {/* Info indicator for fallback or API */}
      <div className={`p-3 rounded-xl border flex gap-2.5 items-center justify-between text-xs font-semibold ${
        flight.isRealTime
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/40 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/40 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
      }`}>
        <div className="flex items-center gap-2">
          {flight.isRealTime ? (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
          )}
          <span>
            {flight.isRealTime
              ? 'Real-Time status data successfully populated from the AviationStack API.'
              : 'Reliable custom data generated for this flight code fallback.'}
          </span>
        </div>
      </div>
    </div>
  );
};
