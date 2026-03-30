import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning, CloudFog, Wind, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type WeatherData = {
  temp: number;
  description: string;
  icon: string;
  city: string;
  humidity: number;
  windSpeed: number;
};

type CurrencyRates = {
  USD: number;
  EUR: number;
  RUB: number;
  KZT: number;
  TRY: number;
};

const weatherIcons: Record<string, React.ElementType> = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  snow: Snowflake,
  thunderstorm: CloudLightning,
  mist: CloudFog,
  fog: CloudFog,
  haze: CloudFog,
  drizzle: CloudRain,
};

const getWeatherIcon = (desc: string) => {
  const lower = desc.toLowerCase();
  for (const [key, Icon] of Object.entries(weatherIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return Cloud;
};

const WeatherCurrency = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch weather using wttr.in (no API key needed)
    const fetchWeather = async () => {
      try {
        // Try to get user's location
        let city = "Bishkek";
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          if (geoRes.ok) {
            const geo = await geoRes.json();
            city = geo.city || "Bishkek";
          }
        } catch {
          // fallback to Bishkek
        }

        const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (res.ok) {
          const data = await res.json();
          const current = data.current_condition?.[0];
          if (current) {
            setWeather({
              temp: parseInt(current.temp_C),
              description: current.weatherDesc?.[0]?.value || "N/A",
              icon: current.weatherDesc?.[0]?.value?.toLowerCase() || "clouds",
              city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
              humidity: parseInt(current.humidity),
              windSpeed: parseInt(current.windspeedKmph),
            });
          }
        }
      } catch {
        // silent fail
      }
    };

    // Fetch currency rates from a free API
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/KGS");
        if (res.ok) {
          const data = await res.json();
          if (data.rates) {
            // We want to show how many KGS per 1 unit of foreign currency
            setRates({
              USD: +(1 / data.rates.USD).toFixed(2),
              EUR: +(1 / data.rates.EUR).toFixed(2),
              RUB: +(1 / data.rates.RUB).toFixed(2),
              KZT: +(1 / data.rates.KZT).toFixed(2),
              TRY: +(1 / data.rates.TRY).toFixed(2),
            });
          }
        }
      } catch {
        // silent fail
      }
    };

    Promise.all([fetchWeather(), fetchRates()]).finally(() => setLoading(false));
  }, []);

  const WeatherIcon = weather ? getWeatherIcon(weather.icon) : Cloud;

  const bishkekTime = time.toLocaleTimeString("ru-RU", {
    timeZone: "Asia/Bishkek",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const bishkekDate = time.toLocaleDateString("ru-RU", {
    timeZone: "Asia/Bishkek",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="glass rounded-xl p-4 animate-pulse">
        <div className="h-20 bg-muted/20 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      className="glass rounded-xl p-5 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Time & Date */}
      <div className="text-center border-b border-border/30 pb-3">
        <div className="text-3xl font-mono font-bold neon-text tracking-wider">
          {bishkekTime}
        </div>
        <div className="text-xs text-muted-foreground mt-1 capitalize">
          {bishkekDate}
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <WeatherIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{weather.temp}°C</div>
              <div className="text-xs text-muted-foreground">{weather.city}</div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <Wind className="w-3 h-3" />
              {weather.windSpeed} км/ч
            </div>
            <div>💧 {weather.humidity}%</div>
            <div className="text-[10px] capitalize">{weather.description}</div>
          </div>
        </div>
      )}

      {/* Currency Rates */}
      {rates && (
        <div className="border-t border-border/30 pt-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Валюта курстары (KGS)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { code: "USD", flag: "🇺🇸", val: rates.USD },
              { code: "EUR", flag: "🇪🇺", val: rates.EUR },
              { code: "RUB", flag: "🇷🇺", val: rates.RUB },
              { code: "TRY", flag: "🇹🇷", val: rates.TRY },
              { code: "KZT", flag: "🇰🇿", val: rates.KZT },
            ]).map((c) => (
              <div key={c.code} className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-1.5 text-xs">
                <span className="flex items-center gap-1.5">
                  <span>{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                </span>
                <span className="font-mono font-semibold text-foreground">{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCurrency;
