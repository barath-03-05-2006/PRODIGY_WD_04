
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CloudDrizzle,
  Wind,
  CloudFog
} from "lucide-react";

interface WeatherIconProps {
  condition: string;
  className?: string;
}

const WeatherIcon = ({ condition, className = "h-12 w-12" }: WeatherIconProps) => {
  const getIcon = () => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className={`${className} text-yellow-300`} />;
      case "clouds":
        return <Cloud className={`${className} text-white/80`} />;
      case "rain":
        return <CloudRain className={`${className} text-blue-300`} />;
      case "drizzle":
        return <CloudDrizzle className={`${className} text-blue-200`} />;
      case "snow":
        return <CloudSnow className={`${className} text-white`} />;
      case "thunderstorm":
        return <CloudLightning className={`${className} text-purple-300`} />;
      case "mist":
      case "fog":
        return <CloudFog className={`${className} text-gray-300`} />;
      default:
        return <Wind className={`${className} text-white/80`} />;
    }
  };

  return getIcon();
};

export default WeatherIcon;
