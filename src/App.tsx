import { useState, useCallback, type FormEvent } from "react";
import "./App.scss";
import api from "./api/api";
import type { ForecastType, ForecastApiResponse } from "./types";
import ForecastCard from "./components/forecastCard/ForecastCard";

const cashKey: string = "weather_city_";
const expireTime: number = 10 * 60 * 1000; // 10 minutes in milliseconds

function App() {
  const [city, setCity] = useState<string>("");
  const [weatherForecast, setWeatherForecast] = useState<ForecastType>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeatherForecast(undefined);
    setCity(e.target.value);
  };

  const getWeather = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const sendRequestForWeather = () => {
        api
          .get<ForecastApiResponse>(
            `current.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${city}&aqi=no`
          )
          .then((response) => {
            const { current: weatherDetails } = response.data;
            const {
              wind_kph: windSpeed,
              condition,
              humidity,
              temp_c: temperature,
            } = weatherDetails;

            const weather: ForecastType = {
              conditions: condition.text,
              humidity,
              windSpeed: Number((windSpeed / 3.6).toFixed(2)),
              temperature,
              icon: condition.icon,
            };

            setWeatherForecast(weather);

            localStorage.setItem(
              `${cashKey}_${city}`,
              JSON.stringify({ value: weather, time: new Date().getTime() })
            );
          })
          .catch((error) => {
            console.log(error.response?.data?.error?.message);
            setErrorMessage(
              error.response.data.error.message ||
                "An error occurred, please try again later"
            );
            setTimeout(() => setErrorMessage(""), 3000);
          })
          .finally(() => setIsLoading(false));
      };

      if (city.length <= 2 || !city) return; //The city name must contain at least 3 characters.

      setIsLoading(true);

      const cashedValue: string | null = localStorage.getItem(
        `${cashKey}_${city}`
      );

      if (cashedValue) {
        const { value, time } = JSON.parse(cashedValue);
        const currentTime = new Date().getTime();
        if (currentTime - time < expireTime) {
          setWeatherForecast(value);
          setIsLoading(false);
        } else {
          localStorage.removeItem(`${cashKey}_${city}`);
          sendRequestForWeather();
        }
      } else {
        sendRequestForWeather();
      }
    },
    [city]
  );

  const getWeatherType = (weatherCondition: string) => {
    const conditionString = weatherCondition.toLowerCase();

    if (conditionString.includes("sunny")) return "sunny";
    if (conditionString.includes("rain")) return "rainy";
    if (conditionString.includes("partly cloudy")) return "partly-cloudy";
    if (conditionString.includes("cloud")) return "cloudy";
    if (conditionString.includes("snow")) return "snowy";
    return "";
  };

  return (
    <section
      className={`forecast-page ${weatherForecast ? getWeatherType(weatherForecast.conditions) : ""}`}
    >
      <h1>Weather forecast</h1>
      <div className="forecast-container">
        <div className="get-weather-form">
          <form onSubmit={getWeather}>
            <input
              type="text"
              onChange={changeCity}
              name="city"
              value={city}
              placeholder="Enter city"
              autoComplete="off"
            />
            <button type="submit" disabled={!city || city.length <= 2}>
              Get weather
            </button>
          </form>
          {isLoading && <p>Please, wait a moment</p>}
          {errorMessage !== "" && (
            <p className="error-message">{errorMessage}</p>
          )}
        </div>

        {weatherForecast && <ForecastCard {...weatherForecast} />}
      </div>
    </section>
  );
}

export default App;
