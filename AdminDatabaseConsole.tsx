import { useState, useEffect } from 'react';
import { FlightData, PredictionDetail, FavoriteFlight, UserSession, LoginLogEntry } from './types';
import { AppTheme, ThemeConfig, getTheme } from './utils/theme';
import { audioManager } from './utils/audio';
import { fetchFlightData } from './utils/api';
import { computeDelayPrediction } from './utils/flightPredictor';
import { AuthScreen } from './components/AuthScreen';
import { SearchSection } from './components/SearchSection';
import { RouteSearch } from './components/RouteSearch';
import { FlightOverview } from './components/FlightOverview';
import { DelayRiskAnalysis } from './components/DelayRiskAnalysis';
import { AirportHubs } from './components/AirportHubs';
import { FavoritesList } from './components/FavoritesList';
import { TicketScanner } from './components/TicketScanner';
import { SettingsModal } from './components/SettingsModal';
import { AdminDatabaseConsole } from './components/AdminDatabaseConsole';
import { Plane, Compass, Bookmark, Award, AlertCircle, RefreshCw, LogOut, Settings, Camera, Globe, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'routes' | 'ticket' | 'hubs' | 'favorites' | 'admin'>('search');
  const [session, setSession] = useState<UserSession | null>(null);

  const [flight, setFlight] = useState<FlightData | null>(null);
  const [prediction, setPrediction] = useState<PredictionDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Settings states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('flight_theme_id') as AppTheme) || 'midnight';
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    return localStorage.getItem('flight_sound_muted') === 'true';
  });

  const [songEnabled, setSongEnabled] = useState<boolean>(() => {
    return localStorage.getItem('flight_song_enabled') !== 'false';
  });

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(() => {
    const cached = localStorage.getItem('flight_current_song');
    return cached ? parseInt(cached, 10) : 0;
  });

  // Dark mode / theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('flight_theme') === 'dark' || 
           (!localStorage.getItem('flight_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Recents state
  const [recents, setRecents] = useState<string[]>(() => {
    const cached = localStorage.getItem('flight_delay_recents');
    return cached ? JSON.parse(cached) : [];
  });

  // Saved/Favorites state
  const [favorites, setFavorites] = useState<FavoriteFlight[]>(() => {
    const cached = localStorage.getItem('flight_delay_favorites');
    return cached ? JSON.parse(cached) : [];
  });

  // Load and play music upon successful login/session load
  useEffect(() => {
    if (session && songEnabled && !soundMuted) {
      audioManager.setMute(soundMuted);
      audioManager.setSongEnabled(songEnabled);
      audioManager.playSong(currentSongIndex);
    } else {
      audioManager.stop();
    }
  }, [session, soundMuted, songEnabled, currentSongIndex]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flight_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flight_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('flight_theme_id', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('flight_sound_muted', String(soundMuted));
    audioManager.setMute(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    localStorage.setItem('flight_song_enabled', String(songEnabled));
    audioManager.setSongEnabled(songEnabled);
  }, [songEnabled]);

  useEffect(() => {
    localStorage.setItem('flight_current_song', String(currentSongIndex));
  }, [currentSongIndex]);

  useEffect(() => {
    localStorage.setItem('flight_delay_recents', JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem('flight_delay_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (searchedFlight: string) => {
    const cleanNo = searchedFlight.toUpperCase().replace(/\s+/g, '').trim();
    setIsLoading(true);
    setError(null);

    // Audio beep on search action
    audioManager.playTone(400, 0.1, 0.05);

    try {
      const data = await fetchFlightData(cleanNo);
      setFlight(data);
      setPrediction(computeDelayPrediction(data));

      // Update recent searches list
      setRecents((prev) => {
        const filtered = prev.filter((item) => item !== cleanNo);
        return [cleanNo, ...filtered].slice(0, 5);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve flight delay metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (targetFlight: FlightData) => {
    const alreadySaved = favorites.find((f) => f.flightNo === targetFlight.flightNo);
    if (alreadySaved) {
      setFavorites(favorites.filter((f) => f.flightNo !== targetFlight.flightNo));
    } else {
      setFavorites([
        ...favorites,
        {
          flightNo: targetFlight.flightNo,
          origin: targetFlight.origin.iata,
          destination: targetFlight.destination.iata,
          airlineName: targetFlight.airlineName
        }
      ]);
    }
  };

  const handleSelectRecent = (recentFlightNo: string) => {
    handleSearch(recentFlightNo);
    setActiveTab('search');
  };

  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem('flight_user_session', JSON.stringify(userSession));
  };

  const handleLogout = () => {
    if (session) {
      // Log logout event persistently
      const cached = localStorage.getItem('flight_auth_logs');
      const logs: LoginLogEntry[] = cached ? JSON.parse(cached) : [];
      logs.push({
        email: session.email,
        fullName: session.fullName,
        action: 'logout',
        timestamp: new Date().toLocaleString()
      });
      localStorage.setItem('flight_auth_logs', JSON.stringify(logs));
    }
    setSession(null);
    localStorage.removeItem('flight_user_session');
    audioManager.stop();
  };

  if (!session) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const currentTheme: ThemeConfig = getTheme(activeTheme);
  const isFavorite = flight ? !!favorites.find((f) => f.flightNo === flight.flightNo) : false;

  // Derive structural dynamic modifiers based on the selected layout
  const getLayoutModifiers = () => {
    switch (currentTheme.layout) {
      case 'cyberpunk':
        return {
          headerWrapper: 'border-b-2 border-fuchsia-500 rounded-none transform skew-x-1 backdrop-blur-md',
          mainContainer: 'flex flex-col lg:flex-row gap-6 p-4 rounded-none border border-fuchsia-500 select-none'
        };
      case 'minimalist':
        return {
          headerWrapper: 'bg-transparent border-b border-indigo-500/20 backdrop-blur-xl',
          mainContainer: 'flex flex-col gap-4 font-mono tracking-tight max-w-4xl mx-auto'
        };
      case 'dashboard':
        return {
          headerWrapper: 'bg-cyan-950/40 border-b border-teal-500/30 rounded-t-3xl',
          mainContainer: 'grid grid-cols-1 md:grid-cols-12 gap-5 px-3 py-4'
        };
      case 'futuristic':
        return {
          headerWrapper: 'bg-amber-950/20 border-b border-amber-500/30 rounded-none',
          mainContainer: 'flex flex-col md:grid md:grid-cols-2 gap-8'
        };
      default:
        return {
          headerWrapper: `bg-white/70 dark:bg-slate-900/70 border-b ${currentTheme.borderClass}`,
          mainContainer: 'flex flex-col gap-6'
        };
    }
  };

  const layoutMods = getLayoutModifiers();

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} ${currentTheme.fontFamily} text-slate-800 dark:text-slate-100 font-sans transition duration-200 overflow-x-hidden`}>
      {/* Settings Panel Modal Component */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTheme={activeTheme}
        onChangeTheme={setActiveTheme}
        isDark={isDark}
        onToggleDark={setIsDark}
        soundMuted={soundMuted}
        onToggleSoundMuted={setSoundMuted}
        songEnabled={songEnabled}
        onToggleSongEnabled={setSongEnabled}
        currentSongIndex={currentSongIndex}
        onSelectSong={setCurrentSongIndex}
      />

      {/* Header and navbar navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md select-none ${layoutMods.headerWrapper}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 ${currentTheme.id === 'neon' ? 'bg-fuchsia-600 rounded-none' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl'} text-white flex items-center justify-center shadow-md select-none`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight flex items-center gap-1">
                AeroRisk <span className={currentTheme.accentClass}>Delay Predictor</span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase leading-none">
                Statistical Air Traffic Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User Session profile banner */}
            <span className="hidden sm:inline-flex text-xs font-bold bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 px-3 py-1.5 rounded-xl mr-2 text-slate-700 dark:text-slate-300">
              Welcome, {session.fullName}
            </span>

            {/* Customizer Panel toggle */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center transition cursor-pointer active:scale-95 text-slate-600 dark:text-slate-400"
              title="Application Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Sign Out Trigger */}
            <button
              onClick={handleLogout}
              className="p-2 w-9 h-9 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center transition cursor-pointer active:scale-95 text-slate-400 hover:text-rose-500"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className={`bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-800/30 p-5 mb-6 flex flex-wrap items-center justify-between gap-4 select-none ${currentTheme.id === 'neon' ? 'rounded-none border-fuchsia-500' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                Empowered by Real-Time Data & Prediction Metrics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate precise probability assessments using live AviationStack flight logs, weather, and traffic models.
              </p>
            </div>
          </div>
          <div className="flex gap-1 bg-white/60 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Plane className="w-3.5 h-3.5" /> Track
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                activeTab === 'routes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Route
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                activeTab === 'ticket'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Scan
            </button>
            <button
              onClick={() => setActiveTab('hubs')}
              className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                activeTab === 'hubs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Radar
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" /> Saved
            </button>
            {session.isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 sm:flex-initial px-3 h-9 flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-lg transition cursor-pointer select-none ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> DB (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Tab contents with layout modifier adjustments */}
        <div className={layoutMods.mainContainer}>
          {activeTab === 'search' && (
            <div className="flex flex-col gap-6 flex-1 w-full">
              <SearchSection
                onSearch={handleSearch}
                isLoading={isLoading}
                recents={recents}
                onSelectRecent={handleSelectRecent}
              />

              {/* Error messages if search fails */}
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                  <div className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex-1">
                    {error}
                  </div>
                </div>
              )}

              {/* No current flight searched placeholder */}
              {!flight && !isLoading && !error && (
                <div className={`border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-12 text-center select-none flex flex-col items-center justify-center ${currentTheme.id === 'neon' ? 'rounded-none border-fuchsia-500' : 'rounded-2xl border-slate-200/50 dark:border-slate-800/50'}`}>
                  <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-500">
                    <Plane className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Search for a Flight To Begin Risk Analysis
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[340px] mt-1.5 leading-relaxed">
                    Provide any standard flight number code to trigger live monitoring and complete algorithm scoring.
                  </p>
                </div>
              )}

              {/* Search Result loading screen */}
              {isLoading && (
                <div className={`border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-12 text-center flex flex-col items-center justify-center min-h-[280px] ${currentTheme.id === 'neon' ? 'rounded-none border-fuchsia-500' : 'rounded-2xl border-slate-200/50 dark:border-slate-800/50'}`}>
                  <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-3 stroke-[2.5]" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Running Predictive Assessment...
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[300px]">
                    Polling real-time databases and calculating meteorological/airspace delay risks.
                  </p>
                </div>
              )}

              {/* Flight Search Results Panels */}
              {!isLoading && flight && prediction && (
                <div className={`${currentTheme.layout === 'dashboard' ? 'flex flex-col gap-6 md:col-span-12' : currentTheme.layout === 'futuristic' ? 'flex flex-col gap-6 md:col-span-2' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'} animate-fade-in`}>
                  <FlightOverview
                    flight={flight}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <DelayRiskAnalysis prediction={prediction} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="w-full flex-1">
              <RouteSearch
                onSelectFlight={(flightNo) => {
                  handleSearch(flightNo);
                  setActiveTab('search');
                }}
              />
            </div>
          )}

          {activeTab === 'ticket' && (
            <div className="flex flex-col gap-6 animate-fade-in flex-1 w-full">
              <TicketScanner
                onAddFlight={(newFlight) => {
                  setFlight(newFlight);
                  setPrediction(computeDelayPrediction(newFlight));
                  setActiveTab('search');
                }}
              />
            </div>
          )}

          {activeTab === 'hubs' && (
            <div className="w-full flex-1">
              <AirportHubs />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="w-full flex-1">
              <FavoritesList
                favorites={favorites}
                onSelect={handleSelectRecent}
                onRemove={(no) => setFavorites(favorites.filter((f) => f.flightNo !== no))}
              />
            </div>
          )}

          {activeTab === 'admin' && session.isAdmin && (
            <div className="w-full flex-1">
              <AdminDatabaseConsole />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
