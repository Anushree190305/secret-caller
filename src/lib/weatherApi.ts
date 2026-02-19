/**
 * Weather API service
 * API key is loaded from .env via VITE_WEATHER_API_KEY
 * This is a public/publishable key — safe to use in frontend code.
 */

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  visibility: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    throw new Error(
      "No API key found. Set VITE_WEATHER_API_KEY in your .env file.\n" +
      "Get a free key at: https://openweathermap.org/api"
    );
  }

  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  console.log(`[API] GET ${BASE_URL}/weather?q=${city}&units=metric`);

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    console.error("[API] Error:", errorMsg);
    throw new Error(errorMsg);
  }

  const data: WeatherData = await response.json();
  console.log("[API] Response:", data);
  return data;
}
