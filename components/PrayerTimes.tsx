
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Loader2, ChevronRight, Moon, Sun, Sunrise } from 'lucide-react';
import { ALADHAN_API_BASE } from '../constants';
import { PrayerTimings } from '../types';

const PrayerTimes: React.FC = () => {
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Ma Position");

  const fetchTimes = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`${ALADHAN_API_BASE}?latitude=${lat}&longitude=${lon}&method=2`);
      const data = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
      } else {
        throw new Error("Erreur API Aladhan");
      }
    } catch (err) {
      setError("Impossible de charger les horaires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchTimes(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Default to Paris if geolocation fails
        setError("Géolocalisation refusée. Utilisation de Paris par défaut.");
        fetchTimes(48.8566, 2.3522);
      }
    );
  }, []);

  const getNextPrayer = () => {
    if (!timings) return null;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerKeys: (keyof PrayerTimings)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const key of prayerKeys) {
      const [h, m] = timings[key].split(':').map(Number);
      const prayerTime = h * 60 + m;
      if (prayerTime > currentTime) return key;
    }
    return 'Fajr'; // Next day
  };

  const nextPrayer = getNextPrayer();

  const PrayerCard = ({ name, time, icon: Icon }: { name: string, time: string, icon: any }) => (
    <div className={`p-4 rounded-2xl flex items-center justify-between transition-all ${nextPrayer === name ? 'bg-emerald-500 text-zinc-950 shadow-lg scale-105' : 'glass text-zinc-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${nextPrayer === name ? 'bg-zinc-950/20' : 'bg-zinc-800'}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">{name}</div>
          <div className="text-xl font-bold">{time}</div>
        </div>
      </div>
      {nextPrayer === name && <ChevronRight size={24} />}
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={40} className="text-emerald-500 animate-spin" />
      <p className="text-zinc-500 animate-pulse">Chargement des horaires...</p>
    </div>
  );

  return (
    <div className="space-y-8 py-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Horaires de Prières</h1>
          <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
            <MapPin size={14} />
            <span>{city}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Date Hejir</div>
          <div className="text-sm font-medium text-emerald-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {error && <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg text-sm">{error}</div>}

      <div className="grid gap-4">
        {timings && (
          <>
            <PrayerCard name="Fajr" time={timings.Fajr} icon={Sunrise} />
            <PrayerCard name="Dhuhr" time={timings.Dhuhr} icon={Sun} />
            <PrayerCard name="Asr" time={timings.Asr} icon={Sun} />
            <PrayerCard name="Maghrib" time={timings.Maghrib} icon={Moon} />
            <PrayerCard name="Isha" time={timings.Isha} icon={Moon} />
          </>
        )}
      </div>

      <div className="glass p-6 rounded-3xl border-dashed border-zinc-700">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Note Spirituelle</h3>
        <p className="text-zinc-300 text-sm leading-relaxed">
          La prière est le pilier de la religion. Veillez à respecter les horaires de votre localité. Les données sont fournies par l'API Aladhan basée sur la méthode de la Ligue Islamique Mondiale.
        </p>
      </div>
    </div>
  );
};

export default PrayerTimes;
