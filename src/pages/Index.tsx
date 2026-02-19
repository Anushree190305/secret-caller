import { useState } from "react";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import heroBg from "@/assets/hero-bg.jpg";

type Status = "idle" | "loading" | "success" | "error";

const SAMPLE_CITIES = ["London", "Tokyo", "New York", "Sydney", "Paris"];

export default function Index() {
  const [city, setCity] = useState("London");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!city.trim()) return;
    setStatus("loading");
    setData(null);
    setError(null);
    setRawJson(null);

    try {
      const result = await fetchWeather(city.trim());
      setData(result);
      setRawJson(JSON.stringify(result, null, 2));
      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("error");
    }
  };

  const statusDot = {
    idle: null,
    loading: <span className="inline-block w-2 h-2 rounded-full status-dot-loading animate-pulse" />,
    success: <span className="inline-block w-2 h-2 rounded-full status-dot-success" />,
    error: <span className="inline-block w-2 h-2 rounded-full status-dot-error" />,
  };

  const hasApiKey =
    import.meta.env.VITE_WEATHER_API_KEY &&
    import.meta.env.VITE_WEATHER_API_KEY !== "your_api_key_here";

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero background */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs mb-6 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Vite + React API Demo
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 glow-text text-primary">
            fetch() + .env
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            API key loaded from <code className="text-primary">VITE_WEATHER_API_KEY</code> in{" "}
            <code className="text-accent">.env</code> — never hardcoded.
          </p>
        </div>

        {/* Env status card */}
        <div className={`glass rounded-lg p-4 mb-6 flex items-start gap-3 ${hasApiKey ? "border-primary/20" : "border-destructive/30"}`}>
          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${hasApiKey ? "status-dot-success" : "status-dot-error"}`} />
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">
              Environment Variable
            </p>
            <code className="text-xs text-foreground">
              VITE_WEATHER_API_KEY={" "}
              <span className={hasApiKey ? "text-primary" : "text-destructive"}>
                {hasApiKey ? '"••••••••••••••••"  ✓ loaded' : '"your_api_key_here"  ✗ not set'}
              </span>
            </code>
            {!hasApiKey && (
              <p className="text-xs text-muted-foreground mt-2">
                Get a free key at{" "}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2"
                >
                  openweathermap.org/api
                </a>{" "}
                then set it in your <code className="text-primary">.env</code> file.
              </p>
            )}
          </div>
        </div>

        {/* Code snippet — how it works */}
        <div className="code-block rounded-lg p-4 mb-6 text-xs leading-relaxed overflow-x-auto">
          <p className="text-muted-foreground mb-2 text-[10px] uppercase tracking-widest">.env</p>
          <p><span className="text-muted-foreground"># Public (publishable) API key</span></p>
          <p><span className="text-accent">VITE_WEATHER_API_KEY</span>=<span className="text-primary">your_api_key_here</span></p>
          <div className="border-t border-border/50 my-3" />
          <p className="text-muted-foreground mb-2 text-[10px] uppercase tracking-widest">weatherApi.ts</p>
          <p><span className="text-muted-foreground">// Loaded automatically by Vite — no dotenv needed</span></p>
          <p><span className="text-accent">const</span> <span className="text-foreground">API_KEY</span> = <span className="text-primary">import.meta.env</span>.<span className="text-accent">VITE_WEATHER_API_KEY</span>;</p>
          <p className="mt-2"><span className="text-accent">const</span> <span className="text-foreground">response</span> = <span className="text-primary">await</span> <span className="text-foreground">fetch</span>(`url?appid={"$"}{"{API_KEY}"}`);</p>
          <p><span className="text-primary">if</span> (!response.<span className="text-accent">ok</span>) <span className="text-primary">throw new</span> <span className="text-foreground">Error</span>(response.<span className="text-accent">statusText</span>);</p>
          <p><span className="text-accent">const</span> <span className="text-foreground">data</span> = <span className="text-primary">await</span> response.<span className="text-accent">json</span>();</p>
        </div>

        {/* Input + Fetch */}
        <div className="glass rounded-lg p-5 mb-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Try It — Fetch Weather</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SAMPLE_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-3 py-1 rounded text-xs border transition-colors ${
                  city === c
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="Enter city name…"
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={handleFetch}
              disabled={status === "loading"}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
            >
              {status === "loading" ? "Fetching…" : "Fetch →"}
            </button>
          </div>
        </div>

        {/* Response area */}
        {status !== "idle" && (
          <div className="glass rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              {statusDot[status]}
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {status === "loading" && "Waiting for response…"}
                {status === "success" && `200 OK — ${data?.name}, ${data?.sys.country}`}
                {status === "error" && "Request Failed"}
              </span>
            </div>

            {/* Error */}
            {status === "error" && error && (
              <div className="border border-destructive/30 bg-destructive/10 rounded p-3">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Error</p>
                <p className="text-sm text-destructive whitespace-pre-wrap">{error}</p>
              </div>
            )}

            {/* Success — structured view */}
            {status === "success" && data && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Temperature", value: `${data.main.temp.toFixed(1)}°C` },
                    { label: "Feels Like", value: `${data.main.feels_like.toFixed(1)}°C` },
                    { label: "Humidity", value: `${data.main.humidity}%` },
                    { label: "Wind", value: `${data.wind.speed} m/s` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-secondary/50 rounded p-3 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                      <p className="text-lg font-bold text-primary">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground text-center capitalize">
                  {data.weather[0]?.description} · Pressure {data.main.pressure} hPa · Visibility {(data.visibility / 1000).toFixed(1)} km
                </div>

                {/* Raw JSON */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Raw JSON Response (also logged to console)</p>
                  <pre className="code-block rounded p-3 text-[11px] text-primary overflow-auto max-h-64">
                    {rawJson}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[11px] text-muted-foreground mt-8">
          Open DevTools → Console to see the raw <code className="text-primary">fetch()</code> call and response logged in real-time.
        </p>
      </div>
    </div>
  );
}
