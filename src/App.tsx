import { useState, useCallback, type FormEvent } from "react";
import "./App.scss";
import api from "./api/api";
import type { ForecastType, ForecastApiResponse } from "./types";
import ForecastCard from "./components/forecastCard/ForecastCard";

function App() {
  const [city, setCity] = useState<string>("");
  const [weatherForecast, setWeatherForecast] = useState<ForecastType>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const changeCity = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCity(e.target.value);

  const getWeather = useCallback((e:FormEvent<HTMLFormElement>) => {
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

          setWeatherForecast({
            conditions: condition.text,
            humidity,
            windSpeed: windSpeed / 3.6,
            temperature,
            icon: condition.icon,
          });
        })
        .catch((error) => {
          console.log(error.response?.data?.error?.message);
          setErrorMessage(
            error.response.data.error.message ||
              "An error occurred, please try again later"
          );
          setTimeout(() => setErrorMessage(""), 3000);
        });
    };
    sendRequestForWeather();
  }, [city]);

  return (
    <>
      <h1>Weather forecast</h1>
      <div>
        <div className="get-weather-inputs">
          <form onSubmit={getWeather}>
          <input type="text" onChange={changeCity} />
          <button type="submit" disabled={!city || city.length <= 2}>
            Get weather
          </button>
          </form>
        </div>
        {errorMessage !== "" && <p className="error-message">{errorMessage}</p>}
      </div>
      {weatherForecast && <ForecastCard {...weatherForecast} />}
    </>
  );
}

export default App;
