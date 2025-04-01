import { useState, useEffect } from "react";
import CitySelector from "./components/CitySelector";
import WeatherCard from "./components/WeatherCard";
import { getWeatherByCity } from "./services/weatherService";
import "./styles/App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Новосибирск");

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
    } catch (error) {
      console.error("Ошибка загрузки погоды:", error);
    }
  };

  const getBackgroundClass = () => {
    if (!weatherData) return "default";
    return weatherData.list[0].weather[0].main.toLowerCase();
  };

  const getTextColorClass = () => {
    if (!weatherData) return "light-text";
    const weatherCondition = weatherData.list[0].weather[0].main.toLowerCase();
    const lightBackgrounds = ["snow", "mist", "clouds"];

    return lightBackgrounds.includes(weatherCondition) ? "dark-text" : "light-text";
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className={`container ${getTextColorClass()}`}>
        <CitySelector onCitySelect={setCity} />
        {weatherData && (
          <>
            <h1>{city}</h1>
            <div className="current-weather">
              <h2>{Math.round(weatherData.list[0].main.temp)}°C</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`}
                alt="weather icon"
              />
            </div>
            <div className="forecast">
              {weatherData.list
                .filter((_, index) => index % 8 === 0)
                .slice(0, 5)
                .map((w, index) => (
                  <WeatherCard
                    key={index}
                    day={new Date(w.dt_txt).toLocaleString("ru-RU", { weekday: "long" })}
                    temp={w.main.temp}
                    icon={w.weather[0].icon}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
