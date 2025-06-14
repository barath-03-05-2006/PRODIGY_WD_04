
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  const fetchWeather = useCallback(async (location: string) => {
    if (!apiKey) {
      setError("Please enter your OpenWeatherMap API key below to fetch weather data.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url: string;
      
      // Check if location is coordinates (latitude,longitude)
      if (location.includes(",")) {
        const [lat, lon] = location.split(",");
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
        } else if (response.status === 404) {
          throw new Error("Location not found. Please try a different city name.");
        } else {
          throw new Error("Failed to fetch weather data. Please try again.");
        }
      }

      const data = await response.json();
      setWeatherData(data);
      
      toast({
        title: "Weather Updated",
        description: `Weather data for ${data.name} has been loaded successfully.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    apiKey,
    setApiKey,
  };
};
