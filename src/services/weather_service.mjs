import { fetchWeatherApi } from "openmeteo";

export default class WeatherService {
  static async getWeather() {
    try {
      const params = {
        latitude: 52.52,
        longitude: 13.41,
        current: ["temperature_2m", "is_day", "precipitation"],
        hourly: [
          "temperature_2m",
          "apparent_temperature",
          "precipitation_probability",
          "precipitation",
          "weather_code",
          "is_day",
        ],
        past_hours: 12,
        forecast_hours: 12,
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Helper function to form time ranges
      const range = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();

      const current = response.current();
      const hourly = response.hourly();

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0).value(),
          isDay: current.variables(1).value(),
          precipitation: current.variables(2).value(),
        },
        hourly: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t, index) => ({
          time: new Date((t + utcOffsetSeconds) * 1000),

          temperature2m: hourly.variables(0).valuesArray()[index],
          apparentTemperature: hourly.variables(1).valuesArray()[index],
          precipitationProbability: hourly.variables(2).valuesArray()[index],
          precipitation: hourly.variables(3).valuesArray()[index],
          weatherCode: hourly.variables(4).valuesArray()[index],
          isDay: hourly.variables(5).valuesArray()[index],
        })),
      };

      return weatherData;
    } catch (e) {
      return e.message;
    }
  }
}
