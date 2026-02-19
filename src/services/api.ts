import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const BACKDROP_SIZE = "w1280";
export const POSTER_SIZE = "w342";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: Movie[];
}

export const fetchTrending = (): Promise<TMDBResponse> =>
  tmdb.get("/trending/all/week").then((r) => r.data);

export const fetchTopRated = (): Promise<TMDBResponse> =>
  tmdb.get("/movie/top_rated").then((r) => r.data);

export const fetchAction = (): Promise<TMDBResponse> =>
  tmdb.get("/discover/movie", { params: { with_genres: 28 } }).then((r) => r.data);

export const fetchComedy = (): Promise<TMDBResponse> =>
  tmdb.get("/discover/movie", { params: { with_genres: 35 } }).then((r) => r.data);

export const fetchNetflixOriginals = (): Promise<TMDBResponse> =>
  tmdb
    .get("/discover/tv", { params: { with_networks: 213 } })
    .then((r) => r.data);
