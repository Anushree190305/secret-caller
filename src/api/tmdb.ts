import axios from "axios";
import type { TMDBResponse } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const BACKDROP_SIZE = "w1280";
export const POSTER_SIZE = "w342";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchTrending = async (): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/trending/movie/week");
  return data;
};

export const fetchPopular = async (): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/movie/popular");
  return data;
};

export const fetchTopRated = async (): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/movie/top_rated");
  return data;
};

export const fetchAction = async (): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/discover/movie", { params: { with_genres: 28 } });
  return data;
};

export const fetchComedy = async (): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/discover/movie", { params: { with_genres: 35 } });
  return data;
};

export const searchMovies = async (query: string): Promise<TMDBResponse> => {
  const { data } = await tmdb.get("/search/movie", { params: { query } });
  return data;
};
