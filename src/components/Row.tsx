import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie, IMAGE_BASE, POSTER_SIZE } from "@/services/api";

interface RowProps {
  title: string;
  movies: Movie[];
}

export default function Row({ title, movies }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    setShowLeftArrow(rowRef.current.scrollLeft > 10);
  };

  if (!movies.length) return null;

  return (
    <div className="mb-2 group/row">
      <h2 className="text-white font-semibold text-lg md:text-xl px-8 md:px-16 mb-3 tracking-wide">
        {title}
      </h2>

      <div className="relative">
        {/* Left arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="text-white" size={28} />
          </button>
        )}

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="text-white" size={28} />
        </button>

        {/* Scroll container */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto row-scroll px-8 md:px-16 pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `${IMAGE_BASE}${POSTER_SIZE}${movie.poster_path}`
              : null;
            const title = movie.title || movie.name || "Untitled";

            if (!posterUrl) return null;

            return (
              <div
                key={movie.id}
                className="relative flex-shrink-0 w-36 md:w-44 lg:w-52 cursor-pointer rounded overflow-hidden transition-all duration-300 ease-out"
                style={{
                  transform: hoveredId === movie.id ? "scale(1.1)" : "scale(1)",
                  zIndex: hoveredId === movie.id ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-auto object-cover block"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2 transition-opacity duration-200"
                  style={{ opacity: hoveredId === movie.id ? 1 : 0 }}
                >
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-green-400 text-xs font-bold">
                      {Math.round(movie.vote_average * 10)}% Match
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
