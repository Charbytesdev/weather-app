/* eslint-disable @typescript-eslint/naming-convention */
import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";

type APICurrentData = {
  temp_c: string;
  temp_f: string;
  feelslike_c: string;
  feelslike_f: string;
};

type ForecastDay = {
  date: string;
  day: {
    maxtemp_c: string;
    maxtemp_f: string;
    mintemp_c: string;
    mintemp_f: string;
  };
};

const [
  searchBarInput,
  searchButton,
  weatherText,
  locationText,
  dateText,
  timeText,
  temperatureText,
  temperatureSwapButton,
  weatherImg,
  feelsLikeText,
  humidityText,
  windSpeedText,
  nextDay1,
  nextDay2,
  day1MAXTemp,
  day2MAXTemp,
  day1MINTemp,
  day2MINTemp,
] = getById(
  "search-bar",
  "search-button",
  "weather-text",
  "location",
  "date",
  "time",
  "temperature",
  "swap-temperature-button",
  "weather-img",
  "feels-like",
  "humidity",
  "wind-speed",
  "next-day1-name",
  "next-day2-name",
  "day1-max-temp",
  "day2-max-temp",
  "day1-min-temp",
  "day2-min-temp"
) as HTMLElement[];

function swapTemperatures(
  current: APICurrentData,
  forecastDays: ForecastDay[],
  localtime: string
) {
  const currentTemp = temperatureText.textContent?.split("°")[1];
  const isCelsius = currentTemp === "C";

  const maxCelsiusTemps = forecastDays
    .slice(1)
    .map((forecastDayElement: ForecastDay) => forecastDayElement.day.maxtemp_c);

  const maxFahrenheitTemps = forecastDays
    .slice(1)
    .map((forecastDayElement: ForecastDay) => forecastDayElement.day.maxtemp_f);

  [day1MAXTemp.textContent, day2MAXTemp.textContent] = isCelsius
    ? maxFahrenheitTemps
    : maxCelsiusTemps;

  temperatureText.textContent = isCelsius
    ? `${current.temp_f}°F`
    : `${current.temp_c}°C`;

  temperatureSwapButton.textContent = isCelsius ? "Display °C" : "Display °F";

  const dateTimeData = new Date(localtime);
  timeText.textContent = isCelsius
    ? format(dateTimeData, `h:mmaaa`)
    : format(dateTimeData, `HH:mm`);

  feelsLikeText.textContent = isCelsius
    ? `${current.feelslike_f}°F`
    : `${current.feelslike_c}°C`;
}

async function getCurrentWeather() {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=360903de59304a0ea59113502232010&days=3&q=${searchBarInput.value}`
    );
    const {
      forecast: { forecastday: forecastDays },
      current,
      current: {
        humidity,
        wind_kph: windKPH,
        condition: { icon, text },
      },
      location: { name, localtime },
    } = await response.json();
    const dateTimeData = new Date(localtime);
    (weatherImg as HTMLImageElement).src = icon;
    weatherText.textContent = text;
    locationText.textContent = name;
    dateText.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    swapTemperatures(current, forecastDays, localtime);
    temperatureSwapButton.onclick = () =>
      swapTemperatures(current, forecastDays, localtime);
    humidityText.textContent = `${humidity}%`;
    windSpeedText.textContent = `${windKPH}km/h`;

    [nextDay1.textContent, nextDay2.textContent] = forecastDays
      .slice(1)
      .map((forecastDayElement: ForecastDay) =>
        format(new Date(forecastDayElement.date), "EEEE")
      );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error?.toString());
  }
}

(searchButton as HTMLButtonElement).onclick = async () => {
  getCurrentWeather();
};
