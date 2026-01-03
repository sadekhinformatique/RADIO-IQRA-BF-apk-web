
import React, { useState } from 'react';
import { ShieldCheck, LogIn, Save, Database, Server, RefreshCw, Radio } from 'lucide-react';
import { RadioConfig } from '../types';

interface Props {
  config: RadioConfig;
  onUpdate: (newConfig: Partial<RadioConfig>) => void;
}

const Admin: React.FC<Props> = ({ config, onUpdate }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState(config);
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // In a real app, this would be a server-side check
      setIsAuthenticated(true);
      setMessage("");
    } else {
      setMessage("Mot de passe incorrect");
    }
  };

  const handleSave = () => {
    onUpdate(form);
    setMessage("Paramètres sauvegardés localement (Simulation SQLite)");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 animate-in zoom-in-95 duration-300">
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Administration</h1>
              <p className="text-zinc-500 text-sm">Veuillez vous identifier pour gérer la radio.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            {message && <p className="text-red-500 text-xs text-center font-medium">{message}</p>}
            <button 
              type="submit"
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <LogIn size={20} />
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion Système</h1>
          <p className="text-zinc-500 text-sm mt-1">Configurez les flux et la base de données.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Save size={18} />
          Enregistrer
        </button>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <RefreshCw size={16} className="animate-spin" />
          {message}
        </div>
      )}

      <div className="grid gap-6">
        <section className="glass p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 text-zinc-100">
            <Radio size={20} className="text-emerald-500" />
            <h2 className="font-bold">Configuration Radio</h2>
          </div>
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nom de la Station</label>
              <input 
                type="text" 
                value={form.stationName}
                onChange={(e) => setForm({...form, stationName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">URL Flux Principal (Icecast/Shoutcast)</label>
              <input 
                type="text" 
                value={form.streamUrl}
                onChange={(e) => setForm({...form, streamUrl: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">URL Playlist de Secours</label>
              <input 
                type="text" 
                value={form.fallbackUrl}
                onChange={(e) => setForm({...form, fallbackUrl: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono text-xs"
              />
            </div>
          </div>
        </section>

        <section className="glass p-6 rounded-3xl space-y-4 opacity-75">
          <div className="flex items-center gap-3 text-zinc-100">
            <Database size={20} className="text-emerald-500" />
            <h2 className="font-bold">État SQLite & Serveur</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Base de données</span>
              <span className="text-emerald-500 font-mono">radio_db.sqlite (Connecté)</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Espace Disque (Audio)</span>
              <span className="text-zinc-300 font-mono">1.2 GB / 5.0 GB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Instance Node.js</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                PM2 Online
              </span>
            </div>
          </div>
          <div className="pt-2">
            <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
              <Server size={12} />
              Voir les logs serveur Infomaniak
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
