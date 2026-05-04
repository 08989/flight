import React from 'react';
import { PredictionDetail } from '../types';
import { Cloud, AlertTriangle, Briefcase, Clock, Sparkles, BarChart2 } from 'lucide-react';

interface DelayRiskAnalysisProps {
  prediction: PredictionDetail;
}

export const DelayRiskAnalysis: React.FC<DelayRiskAnalysisProps> = ({
  prediction
}) => {
  const { overallRisk, factors, details, commentary, advanced } = prediction;

  // Get color based on overall risk
  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-emerald-500 stroke-emerald-500';
    if (risk < 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getBarColor = (risk: number) => {
    if (risk < 30) return 'bg-emerald-500';
    if (risk < 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const circumference = 2 * Math.PI * 40; // radius = 40
  const offset = circumference - (overallRisk / 100) * circumference;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
            <Sparkles className="w-4 h-4 text-amber-500" /> Delay Risk Assessment
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Statistical prediction algorithm factoring multiple parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-5 select-none">
        {/* Ring Chart Column */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50/40 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/40">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-200 dark:text-slate-800"
              />
              {/* Overlay active circle */}
              <circle
                cx="64"
                cy="64"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                className={`${getRiskColor(overallRisk)} transition-all duration-700 ease-out`}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center select-none">
              <span className={`text-3xl font-black ${getRiskColor(overallRisk).split(' ')[0]}`}>
                {overallRisk}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Delay Risk
              </span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-center mt-3 tracking-wide bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400">
            {overallRisk < 30 ? 'High On-Time Probability' : overallRisk < 60 ? 'Moderate Delay Potential' : 'Significant Delay Alert'}
          </p>
        </div>

        {/* Individual Factors & descriptions */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {/* Weather */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Cloud className="w-3.5 h-3.5 text-blue-500" /> Terminal Weather conditions
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{factors.weather}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
              <div className={`h-full ${getBarColor(factors.weather)} rounded-full`} style={{ width: `${factors.weather}%` }}></div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {details.weatherDesc}
            </span>
          </div>

          {/* Traffic */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> ATC & Airport traffic
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{factors.airTraffic}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
              <div className={`h-full ${getBarColor(factors.airTraffic)} rounded-full`} style={{ width: `${factors.airTraffic}%` }}></div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {details.airTrafficDesc}
            </span>
          </div>

          {/* History */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Airline historical record
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{factors.history}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
              <div className={`h-full ${getBarColor(factors.history)} rounded-full`} style={{ width: `${factors.history}%` }}></div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {details.historyDesc}
            </span>
          </div>

          {/* Time of Day */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-500" /> Time-of-day slot risk
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{factors.timeOfDay}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
              <div className={`h-full ${getBarColor(factors.timeOfDay)} rounded-full`} style={{ width: `${factors.timeOfDay}%` }}></div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {details.timeDesc}
            </span>
          </div>
        </div>
      </div>

      {/* THREE EXTRA ADVANCED ALGORITHMS EXTRA CARD (If available) */}
      {advanced && (
        <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 select-none">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 select-none">
            <BarChart2 className="w-4 h-4 text-emerald-500" /> Multi-Algorithm Advanced Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Algo 1: METAR decoder */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                  1. Weather METAR
                </span>
                <div className="flex justify-between items-center my-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Turbulence Risk</span>
                  <span className={`text-sm font-black ${getRiskColor(advanced.metarRisk).split(' ')[0]}`}>{advanced.metarRisk}%</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  {advanced.metarDesc}
                </p>
              </div>
            </div>

            {/* Algo 2: Airspace queuing */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                  2. Holding Patterns
                </span>
                <div className="flex justify-between items-center my-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Queue Time</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">+{advanced.airspaceMinutes} mins</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  {advanced.airspaceDesc}
                </p>
              </div>
            </div>

            {/* Algo 3: Fleet Cascading rotation */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                  3. Fleet Turnaround
                </span>
                <div className="flex justify-between items-center my-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Rotation Risk</span>
                  <span className={`text-sm font-black ${getRiskColor(advanced.cascadingRisk).split(' ')[0]}`}>{advanced.cascadingRisk}%</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  {advanced.cascadingDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Artificial Intelligence commentary explanation */}
      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/40 dark:border-blue-900/30 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 mt-4 leading-relaxed">
        <div className="text-lg animate-pulse flex-shrink-0">🤖</div>
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 select-none block mb-0.5">
            Predictive AI Insights
          </span>
          {commentary}
        </div>
      </div>
    </div>
  );
};
