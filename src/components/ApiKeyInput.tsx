
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onSave: () => void;
}

const ApiKeyInput = ({ apiKey, setApiKey, onSave }: ApiKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempKey);
    localStorage.setItem("weather-api-key", tempKey);
    onSave();
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenWeatherMap API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="Enter your OpenWeatherMap API key"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
          disabled={!tempKey.trim()}
        >
          Save API Key
        </Button>
        <p className="text-white/60 text-sm text-center">
          Get your free API key from{" "}
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white underline"
          >
            OpenWeatherMap
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
