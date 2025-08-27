export interface ForecastType {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  icon: string;
}

export interface ForecastApiResponse {
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}
