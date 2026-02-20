import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (rowRef.current) setShowLeft(rowRef.current.scrollLeft > 10);
  };

  if (!movies.length) return null;

  return (
    <div className="mb-2 group/row">
      <h2 className="text-foreground font-semibold text-lg md:text-xl px-8 md:px-16 mb-3 tracking-wide">
        {title}
      </h2>
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="text-foreground" size={28} />
          </button>
        )}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="text-foreground" size={28} />
        </button>
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto px-8 md:px-16 pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
