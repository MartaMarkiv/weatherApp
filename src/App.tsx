import { useState, useCallback } from "react";
import "./App.css";
import api from "./api/api";
import type { ForecastType } from "./types";
import ForecastCard from "./components/forecastCard/ForecastCard";

function App() {
  const [city, setCity] = useState<string>("");
  const [weatherForecast, setWeatherForecast] = useState<ForecastType>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const changeSity = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCity(e.target.value);

  const getWeather = useCallback(() => {
    const sendRequestForWeather = () => {
      api
        .get(
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
            windSpeed,
            temperature,
            icon: condition.icon,
          });
        })
        .catch((error) => {
          console.log(error.response.data.error.message);
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
        <div>
          <input type="text" onChange={changeSity} />
          <button onClick={getWeather} disabled={!city || city.length <= 2}>
            get
          </button>
          {errorMessage !== "" && (
            <p className="error-message">{errorMessage}</p>
          )}
        </div>
      </div>
      {!!weatherForecast && <ForecastCard {...weatherForecast} />}
    </>
  );
}

export default App;
