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
      <div className="card-header">
        <img alt="Weather forecas" src={icon} />
        <p>{temperature}&deg;C.</p>
      </div>
      <p className="conditions">{conditions}</p>
      <p>Humidity: {humidity}%</p>
      <p>Wind: {windSpeed} m/s</p>
    </div>
  );
}
