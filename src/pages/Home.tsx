import { useEffect, useState } from "react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeBanner from "@/components/HomeBanner";
import MovieRow from "@/components/MovieRow";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { fetchTrending, fetchPopular, fetchTopRated, fetchAction, fetchComedy } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

interface RowData {
  title: string;
  movies: Movie[];
}

export default function Home() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [trending, popular, topRated, action, comedy] = await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchTopRated(),
          fetchAction(),
          fetchComedy(),
        ]);
        setRows([
          { title: "Trending Now", movies: trending.results },
          { title: "Popular", movies: popular.results },
          { title: "Top Rated", movies: topRated.results },
          { title: "Action", movies: action.results },
          { title: "Comedy", movies: comedy.results },
        ]);
      } catch (err: any) {
        console.error("[TMDB]", err);
        setError(err?.response?.data?.status_message || err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 bg-background">
        <div className="text-primary text-6xl font-black">!</div>
        <h2 className="text-foreground text-xl font-bold">API Error</h2>
        <p className="text-muted-foreground text-center max-w-md text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar
        onSearchResults={(movies) => setSearchResults(movies)}
        onSearchClear={() => setSearchResults(null)}
      />

      {searchResults ? (
        <div className="pt-24 px-8 md:px-16 pb-20">
          <h2 className="text-foreground text-2xl font-bold mb-6">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((movie) => {
              if (!movie.poster_path) return null;
              return (
                <div
                  key={movie.id}
                  className="cursor-pointer rounded overflow-hidden hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
          {searchResults.length === 0 && (
            <p className="text-muted-foreground text-center mt-12">No results found.</p>
          )}
        </div>
      ) : (
        <>
          <HomeBanner onMoreInfo={(movie) => setSelectedMovie(movie)} />
          <div className="relative z-10 -mt-8 pb-20 space-y-6">
            {rows.map((row) => (
              <MovieRow
                key={row.title}
                title={row.title}
                movies={row.movies}
                onMovieClick={(movie) => setSelectedMovie(movie)}
              />
            ))}
          </div>
        </>
      )}

      {selectedMovie && (
        <Modal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
