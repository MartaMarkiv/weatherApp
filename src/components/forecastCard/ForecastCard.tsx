import type { ForecastType } from "../../types";
import "./style.scss";

export default function ForecastCard({
  conditions,
  humidity,
  icon,
  temperature,
  windSpeed,
}: ForecastType) {
  return (
    <div className="forecast-card">
      <div>
        <img alt="Weather forecas" src={icon} />
        <p>{temperature}</p>
      </div>
      <p>{conditions}</p>
      <p>Humidity: {humidity}%</p>
      <p>Wind: {windSpeed} km/h</p>
    </div>
  );
}
