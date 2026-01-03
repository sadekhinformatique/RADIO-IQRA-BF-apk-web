
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, AlertCircle, Headphones } from 'lucide-react';
import { RadioConfig } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: RadioConfig;
}

const RadioPlayer: React.FC<Props> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [status, setStatus] = useState<'checking' | 'online' | 'fallback'>('checking');
  const [quote, setQuote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  useEffect(() => {
    const fetchInspiration = async () => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Donne une courte citation inspirante ou un verset apaisant en français pour une application de radio spirituelle. Juste le texte.",
        });
        setQuote(response.text);
      } catch (e) {
        console.error("Gemini failed", e);
      }
    };
    fetchInspiration();
  }, []);

  const checkStream = async () => {
    setStatus('checking');
    try {
      const response = await fetch(config.streamUrl, { method: 'HEAD', mode: 'no-cors' });
      // Note: Opaque responses from no-cors are tricky, but if the browser can't even start fetching, it's down
      setStatus('online');
    } catch (e) {
      console.warn("Stream unavailable, switching to fallback", e);
      setStatus('fallback');
    }
  };

  useEffect(() => {
    checkStream();
  }, [config.streamUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setStatus('fallback');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const activeUrl = status === 'fallback' ? config.fallbackUrl : config.streamUrl;

  return (
    <div className="flex flex-col items-center gap-8 py-10 animate-in fade-in duration-700">
      <div className="relative group">
        <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-zinc-900 flex items-center justify-center border-4 border-emerald-500/20 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-full h-1 bg-emerald-500 animate-[bounce_1s_infinite]"></div>
              <div className="w-full h-1 bg-emerald-400 animate-[bounce_1.2s_infinite]"></div>
              <div className="w-full h-1 bg-emerald-600 animate-[bounce_0.8s_infinite]"></div>
            </div>
          )}
          <Headphones size={120} className="text-zinc-800" />
        </div>
        
        {status === 'online' && (
          <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase live-pulse text-white shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Live
          </div>
        )}

        {status === 'fallback' && (
          <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-amber-500 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-lg">
            <AlertCircle size={12} />
            Playlist Locale
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{config.stationName}</h1>
        <p className="text-zinc-400 text-sm font-medium italic max-w-xs mx-auto">
          {quote ? `« ${quote} »` : "Votre source de sérénité quotidienne"}
        </p>
      </div>

      <div className="w-full max-w-sm glass rounded-3xl p-6 space-y-6">
        <audio 
          ref={audioRef} 
          src={activeUrl} 
          muted={isMuted}
          onEnded={() => setIsPlaying(false)}
        />
        
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 text-zinc-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          <button 
            onClick={togglePlay}
            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={checkStream}
            className="p-3 text-zinc-400 hover:text-white transition-colors"
          >
            <Radio size={24} className={status === 'checking' ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex items-center gap-4 px-2">
          <Volume2 size={16} className="text-zinc-500" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="flex-grow accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="text-zinc-500 text-xs flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500' : status === 'fallback' ? 'bg-amber-500' : 'bg-zinc-700'}`}></div>
        Flux: {status === 'online' ? 'Direct Actif' : status === 'fallback' ? 'Mode Secours (Serveur)' : 'Vérification...'}
      </div>
    </div>
  );
};

export default RadioPlayer;
