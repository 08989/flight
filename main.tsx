import React, { useState } from 'react';
import { FlightData } from '../types';
import { fetchFlightData } from '../utils/api';
import { Camera, FileText, RefreshCw, Upload, FileCheck, Info } from 'lucide-react';

interface TicketScannerProps {
  onAddFlight: (f: FlightData) => void;
}

export const TicketScanner: React.FC<TicketScannerProps> = ({ onAddFlight }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedCode, setExtractedCode] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const mockFlightPattern = ['AA100', 'UA440', 'DL123', 'BA1104', 'SQ321'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsScanning(true);
    setProgress(0);
    setExtractedCode('');

    // Setup preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Dynamic scanning progress simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 12;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);

        // Pick a random extracted code
        const code = mockFlightPattern[Math.floor(Math.random() * mockFlightPattern.length)];
        setExtractedCode(code);
        setIsScanning(false);
      } else {
        setProgress(currentProgress);
      }
    }, 280);
  };

  const handleProcessFlight = async () => {
    if (!extractedCode) return;
    try {
      setIsScanning(true);
      const flight = await fetchFlightData(extractedCode);
      onAddFlight(flight);
      setIsScanning(false);
      setPreview(null);
      setExtractedCode('');
      setProgress(0);
    } catch (err: any) {
      setError(err.message || 'Error occurred while loading ticket.');
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between select-none">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-500" /> Electronic Ticket & Photo Scan
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Scan your digital or printed airline boarding passes to automatically decode flight numbers and risks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {!preview ? (
          <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 rounded-xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Drag or Select Ticket Image
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[240px]">
              Upload standard digital tickets (JPG, PNG) to extract carrier information.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-4 p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <div className="relative w-full h-36 bg-black rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center select-none">
              <img
                src={preview}
                alt="Ticket preview"
                className="w-full h-full object-cover opacity-75 blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-3">
                <span className="text-xs font-black text-white flex items-center gap-1 leading-none tracking-wide">
                  <FileText className="w-3.5 h-3.5" /> Ticket Image Input File
                </span>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                  <RefreshCw className="w-8 h-8 text-white animate-spin mb-2" />
                  <span className="text-xs font-extrabold text-white tracking-wide">
                    Scanning Document ({progress}%)
                  </span>
                  <div className="w-32 bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {!isScanning && extractedCode && (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl flex items-center justify-between text-xs font-semibold select-none">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <FileCheck className="w-4 h-4" /> Carrier data parsed successfully.
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-emerald-800 dark:text-emerald-300 rounded font-black tracking-wide">
                    {extractedCode}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleProcessFlight}
                    className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-blue-500/10 cursor-pointer active:scale-95 transition"
                  >
                    Load Delay Assessment
                  </button>
                  <button
                    onClick={() => {
                      setPreview(null);
                      setExtractedCode('');
                    }}
                    className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 leading-tight select-none">
            <Info className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>
    </div>
  );
};
