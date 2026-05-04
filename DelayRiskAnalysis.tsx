import React, { useState } from 'react';
import { Compass, AlertCircle, RefreshCw } from 'lucide-react';

interface HubAirport {
  iata: string;
  name: string;
  city: string;
  country: string;
  delayRisk: number; // 0-100
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
}

const DEFAULT_HUBS: HubAirport[] = [
  {
    iata: 'LHR',
    name: 'London Heathrow',
    city: 'London',
    country: 'United Kingdom',
    delayRisk: 42,
    stressLevel: 'moderate',
    description: 'Moderate volume; expect slightly extended queue times during peak European arrivals.'
  },
  {
    iata: 'JFK',
    name: 'John F. Kennedy Intl.',
    city: 'New York',
    country: 'United States',
    delayRisk: 65,
    stressLevel: 'high',
    description: 'High local volume and airspace congestion causing minor gate queues.'
  },
  {
    iata: 'DXB',
    name: 'Dubai International',
    city: 'Dubai',
    country: 'UAE',
    delayRisk: 18,
    stressLevel: 'low',
    description: 'Extremely efficient passenger processing with optimal visual conditions.'
  },
  {
    iata: 'HND',
    name: 'Tokyo Haneda',
    city: 'Tokyo',
    country: 'Japan',
    delayRisk: 12,
    stressLevel: 'low',
    description: 'Exceptional on-time departures with clear tarmac routing protocols.'
  },
  {
    iata: 'ORD',
    name: 'Chicago O\'Hare Intl.',
    city: 'Chicago',
    country: 'United States',
    delayRisk: 78,
    stressLevel: 'severe',
    description: 'Terminal snow conditions and heavy airline routing causing runway hold.'
  },
  {
    iata: 'AMS',
    name: 'Amsterdam Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    delayRisk: 52,
    stressLevel: 'moderate',
    description: 'Winds off the North Sea cause variable single-runway operations.'
  }
];

export const AirportHubs: React.FC = () => {
  const [hubs, setHubs] = useState<HubAirport[]>(DEFAULT_HUBS);

  const getLevelColor = (level: HubAirport['stressLevel']) => {
    switch (level) {
      case 'low': return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400';
      case 'moderate': return 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400';
      case 'high': return 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400';
      case 'severe': return 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
    }
  };

  const handleRefresh = () => {
    // Regenerate randomized delay risk based on base risk +- 15 to mimic current live stress
    const updated = hubs.map((hub) => {
      const shift = Math.floor(Math.random() * 30) - 15;
      const risk = Math.min(100, Math.max(5, hub.delayRisk + shift));
      let stressLevel: HubAirport['stressLevel'] = 'low';
      if (risk > 70) stressLevel = 'severe';
      else if (risk > 45) stressLevel = 'high';
      else if (risk > 25) stressLevel = 'moderate';
      return { ...hub, delayRisk: risk, stressLevel };
    });
    setHubs(updated);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2 select-none">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" /> Global Airport Stress Radar
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Real-time status rating of major flight hubs to monitor potential disruptions.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Radar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((hub) => (
          <div key={hub.iata} className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-200/60 dark:hover:border-slate-700/60 transition">
            <div className="flex justify-between items-start gap-2 mb-2 select-none">
              <div>
                <span className="text-sm font-black tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                  {hub.iata}
                </span>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {hub.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {hub.city}, {hub.country}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-extrabold uppercase tracking-widest px-2 py-1 rounded-md mb-1 select-none ${getLevelColor(hub.stressLevel)}`}>
                  {hub.stressLevel}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Risk: <b className="text-slate-700 dark:text-slate-300">{hub.delayRisk}%</b>
                </span>
              </div>
            </div>
            
            <div className="mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-2 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-normal select-none">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>{hub.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
