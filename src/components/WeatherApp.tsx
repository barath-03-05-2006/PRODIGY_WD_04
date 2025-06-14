import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Sunrise,
  Sunset
} from "lucide-react";
import WeatherIcon from "./WeatherIcon";
import { useWeather } from "@/hooks/useWeather";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const { weatherData, loading, error, fetchWeather, apiKey, setApiKey } = useWeather();

  useEffect(() => {
    // Set the API key directly
    const defaultApiKey = "e1332584af4a7a7f3090980928b49ae4";
    setApiKey(defaultApiKey);
  }, [setApiKey]);

  useEffect(() => {
    // Try to get user's location on component mount, but only if we have an API key
    if (apiKey && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
          setCurrentLocation("Current Location");
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to London if geolocation fails
          fetchWeather("London");
          setCurrentLocation("London");
        }
      );
    } else if (apiKey) {
      // Default to London if geolocation not supported
      fetchWeather("London");
      setCurrentLocation("London");
    }
  }, [fetchWeather, apiKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
      setCurrentLocation(location);
      setLocation("");
    }
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return "from-blue-400 via-blue-500 to-blue-600";
    
    const condition = weatherData.weather[0].main.toLowerCase();
    switch (condition) {
      case "clear":
        return "from-yellow-400 via-orange-500 to-red-500";
      case "clouds":
        return "from-gray-400 via-gray-500 to-gray-600";
      case "rain":
        return "from-blue-600 via-blue-700 to-blue-800";
      case "snow":
        return "from-blue-100 via-blue-200 to-blue-300";
      case "thunderstorm":
        return "from-gray-700 via-gray-800 to-black";
      default:
        return "from-blue-400 via-blue-500 to-blue-600";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 p-4`}>
      <div className="container mx-auto max-w-4xl pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Weather App
          </h1>
          <p className="text-white/80 text-lg">
            Get current weather conditions for any location
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Enter city name (e.g., London, New York)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 backdrop-blur-md bg-red-500/20 border-red-300/30">
            <CardContent className="p-4">
              <p className="text-white text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Weather Data */}
        {weatherData && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <MapPin className="h-5 w-5 text-white/80" />
                  <h2 className="text-2xl font-semibold text-white">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <WeatherIcon 
                        condition={weatherData.weather[0].main}
                        className="h-20 w-20"
                      />
                      <div>
                        <p className="text-6xl font-bold text-white">
                          {Math.round(weatherData.main.temp)}°C
                        </p>
                        <p className="text-white/80 text-lg capitalize">
                          {weatherData.weather[0].description}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/70">
                      Feels like {Math.round(weatherData.main.feels_like)}°C
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-white/10">
                      <Thermometer className="h-6 w-6 text-white/80 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Min/Max</p>
                      <p className="text-white font-semibold">
                        {Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/10">
                      <Droplets className="h-6 w-6 text-white/80 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Humidity</p>
                      <p className="text-white font-semibold">{weatherData.main.humidity}%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/10">
                      <Wind className="h-6 w-6 text-white/80 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Wind Speed</p>
                      <p className="text-white font-semibold">{weatherData.wind.speed} m/s</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/10">
                      <Eye className="h-6 w-6 text-white/80 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Visibility</p>
                      <p className="text-white font-semibold">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sunrise className="h-6 w-6 text-white/80" />
                    <h3 className="text-xl font-semibold text-white">Sunrise</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sunset className="h-6 w-6 text-white/80" />
                    <h3 className="text-xl font-semibold text-white">Sunset</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!weatherData && !loading && apiKey && (
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/80 text-lg mb-4">
                Ready to fetch weather data! Use the search bar above or we'll automatically detect your location.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
