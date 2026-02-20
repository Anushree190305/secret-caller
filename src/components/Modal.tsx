import { X, Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import { IMAGE_BASE, BACKDROP_SIZE } from "@/api/tmdb";

interface ModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function Modal({ movie, onClose }: ModalProps) {
  const title = movie.title || movie.name || "Untitled";
  const date = movie.release_date || movie.first_air_date || "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-card rounded-lg overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        {movie.backdrop_path && (
          <div className="relative h-64 md:h-80">
            <img
              src={`${IMAGE_BASE}${BACKDROP_SIZE}${movie.backdrop_path}`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
        >
          <X className="text-foreground" size={20} />
        </button>

        {/* Content */}
        <div className="p-6 -mt-12 relative">
          <h2 className="text-foreground text-2xl md:text-3xl font-bold mb-3">{title}</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="flex items-center gap-1 text-green-400 font-semibold">
              <Star size={14} fill="currentColor" />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-muted-foreground">{date}</span>
            <span className="text-muted-foreground uppercase text-xs bg-secondary px-2 py-0.5 rounded">
              {movie.original_language || "en"}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{movie.overview || "No overview available."}</p>
        </div>
      </div>
    </div>
  );
}
