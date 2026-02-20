import { useState } from "react";
import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import { IMAGE_BASE, POSTER_SIZE } from "@/api/tmdb";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}${POSTER_SIZE}${movie.poster_path}`
    : null;
  const title = movie.title || movie.name || "Untitled";

  if (!posterUrl) return null;

  return (
    <div
      className="relative flex-shrink-0 w-36 md:w-44 lg:w-52 cursor-pointer rounded overflow-hidden transition-all duration-300 ease-out"
      style={{
        transform: hovered ? "scale(1.1)" : "scale(1)",
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(movie)}
    >
      <img
        src={posterUrl}
        alt={title}
        className="w-full h-auto object-cover block"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <p className="text-foreground text-xs font-semibold leading-tight line-clamp-2">{title}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-yellow-400" fill="currentColor" />
          <span className="text-green-400 text-xs font-bold">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
