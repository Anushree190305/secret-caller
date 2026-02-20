import { useState, useEffect } from "react";
import { fetchTrending, IMAGE_BASE, BACKDROP_SIZE } from "@/api/tmdb";
import { Play, Info } from "lucide-react";
import type { Movie } from "@/types/movie";

interface BannerProps {
  onMoreInfo: (movie: Movie) => void;
}

export default function Banner({ onMoreInfo }: BannerProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending()
      .then((data) => {
        const picks = data.results.filter((m) => m.backdrop_path);
        setMovie(picks[Math.floor(Math.random() * Math.min(picks.length, 5))]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[85vh] min-h-[500px] bg-muted animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie || !movie.backdrop_path) return null;

  const title = movie.title || movie.name || "";

  return (
    <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">
      <img
        src={`${IMAGE_BASE}${BACKDROP_SIZE}${movie.backdrop_path}`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />

      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight drop-shadow-2xl animate-fade-in">
          {title}
        </h1>
        <p className="text-sm md:text-base text-foreground/90 mb-8 leading-relaxed line-clamp-3 drop-shadow animate-fade-in">
          {movie.overview}
        </p>
        <div className="flex gap-3 animate-fade-in">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-bold rounded hover:bg-foreground/85 transition-colors text-sm md:text-base">
            <Play size={18} fill="currentColor" />
            Play
          </button>
          <button
            onClick={() => onMoreInfo(movie)}
            className="flex items-center gap-2 px-6 py-2.5 bg-foreground/25 text-foreground font-semibold rounded hover:bg-foreground/35 backdrop-blur-sm transition-colors text-sm md:text-base border border-foreground/20"
          >
            <Info size={18} />
            More Info
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
