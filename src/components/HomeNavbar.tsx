import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Search, LogOut } from "lucide-react";
import { searchMovies } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

interface NavbarProps {
  onSearchResults?: (movies: Movie[]) => void;
  onSearchClear?: () => void;
}

export default function Navbar({ onSearchResults, onSearchClear }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      onSearchClear?.();
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await searchMovies(query);
        onSearchResults?.(data.results);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-3 transition-all duration-500"
      style={{
        background: scrolled
          ? "hsl(0 0% 5% / 0.97)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}
    >
      <div className="flex items-center gap-8">
        <Link to="/home" className="text-primary font-extrabold text-2xl tracking-wider">
          NETFLIX
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/home" className="text-foreground hover:text-foreground/80 transition-colors">
            Home
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center">
          {searchOpen && (
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="bg-secondary/80 border border-border text-foreground text-sm px-3 py-1.5 rounded mr-2 w-40 md:w-64 outline-none placeholder:text-muted-foreground"
            />
          )}
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (searchOpen) { setQuery(""); onSearchClear?.(); }
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
