import { fetchWeatherApi } from 'openmeteo';

export async function getWeatherInfo() {
  const params = {
    latitude: 53.9006,
    longitude: 27.5667,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code,precipitation',
    wind_speed_unit: 'ms',
    forecast_days: 1,
  };

  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const current = response.current();

  return {
    temp: Math.round(current.variables(0).value()),
    humidity: current.variables(1).value(),
    windSpeed: current.variables(2).value().toFixed(2),
    apparentTemp: Math.round(current.variables(3).value()),
    weatherCode: current.variables(4).value(),
    precipitation: current.variables(5).value(),
  };
}

export function interpretWeather(code) {
  const table = {
    0: '☀️ Ясно',
    1: '🌤️ Преимущественно ясно',
    2: '⛅ Переменная облачность',
    3: '☁️ Пасмурно',
    45: '🌫️ Туман',
    61: '🌧️ Небольшой дождь',
    71: '❄️ Небольшой снег',
  };
  return table[code] || 'Неизвестная погода';
}
