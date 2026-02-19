import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Row from "@/components/Row";
import {
  fetchTrending,
  fetchTopRated,
  fetchAction,
  fetchComedy,
  fetchNetflixOriginals,
  Movie,
} from "@/services/api";

interface RowData {
  title: string;
  movies: Movie[];
}

export default function Index() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasKey =
      import.meta.env.VITE_TMDB_API_KEY &&
      import.meta.env.VITE_TMDB_API_KEY !== "your_api_key_here";

    if (!hasKey) {
      setError("VITE_TMDB_API_KEY not set in .env");
      setLoading(false);
      return;
    }

    Promise.all([
      fetchNetflixOriginals(),
      fetchTrending(),
      fetchTopRated(),
      fetchAction(),
      fetchComedy(),
    ])
      .then(([originals, trending, topRated, action, comedy]) => {
        setRows([
          { title: "Netflix Originals", movies: originals.results },
          { title: "Trending Now", movies: trending.results },
          { title: "Top Rated", movies: topRated.results },
          { title: "Action Thrillers", movies: action.results },
          { title: "Comedies", movies: comedy.results },
        ]);
      })
      .catch((err) => {
        console.error("[TMDB]", err);
        setError(err?.response?.data?.status_message || err.message || "Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
          <div className="text-primary text-6xl font-black">!</div>
          <h2 className="text-white text-xl font-bold">API Error</h2>
          <p className="text-muted-foreground text-center max-w-md text-sm">{error}</p>
          <div className="mt-4 bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground font-mono max-w-sm w-full">
            <p className="text-primary mb-1"># .env</p>
            <p>VITE_TMDB_API_KEY=<span className="text-white">your_key_here</span></p>
            <p className="mt-2 text-muted-foreground/70">
              Get a free key at tmdb.org/settings/api
            </p>
          </div>
        </div>
      ) : (
        <>
          <Banner />
          <div className="relative z-10 -mt-8 pb-20 space-y-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-8 md:px-16">
                    <div className="h-5 w-40 bg-muted rounded animate-pulse mb-3" />
                    <div className="flex gap-2 overflow-hidden">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <div
                          key={j}
                          className="flex-shrink-0 w-36 md:w-44 h-56 md:h-64 bg-muted rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ))
              : rows.map((row) => (
                  <Row key={row.title} title={row.title} movies={row.movies} />
                ))}
          </div>
        </>
      )}
    </div>
  );
}
