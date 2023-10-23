import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";

type APITempData = {
  temp_c: string;
  temp_f: string;
  feelslike_c: string;
  feelslike_f: string;
};

type ForecastDayElement = {
  date: string;
  temp: {
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
  nextDay3,
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
  "next-day1",
  "next-day2",
  "next-day3"
) as HTMLElement[];

(searchButton as HTMLButtonElement).onclick = async () => {
  getCurrentWeather();
};

async function getCurrentWeather() {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=360903de59304a0ea59113502232010&days=3&q=${searchBarInput.value}`
    );
    const {
      forecast: { forecastday },
      current,
      current: {
        temp_c,
        humidity,
        feelslike_c,
        wind_kph,
        condition: { icon, text },
      },
      location: { name, localtime },
    } = await response.json();
    const dateTimeData = new Date(localtime);
    (weatherImg as HTMLImageElement).src = icon;
    weatherText.textContent = text;
    locationText.textContent = name;
    dateText.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    swapTemperatures(current, localtime);
    temperatureSwapButton.onclick = () => swapTemperatures(current, localtime);
    humidityText.textContent = `${humidity}%`;
    windSpeedText.textContent = `${wind_kph}km/h`;
    [nextDay1.textContent, nextDay2.textContent, nextDay3.textContent] =
      forecastday.map((forecastDayElement: ForecastDayElement) =>
        format(new Date(forecastDayElement.date), "EEEE")
      );
    forecastday.map(
      (forecastdayElement: ForecastDayElement) =>
        forecastdayElement.temp.maxtemp_c
    );
  } catch (error) {
    console.log(error);
  }
}

function swapTemperatures(data: APITempData, localtime: string) {
  const currentTemp = temperatureText.textContent?.split("°")[1];
  const isCelsius = currentTemp == "C";

  temperatureText.textContent = isCelsius
    ? `${data.temp_f}°F`
    : `${data.temp_c}°C`;

  temperatureSwapButton.textContent = isCelsius ? "Display °C" : "Display °F";

  const dateTimeData = new Date(localtime);
  timeText.textContent = isCelsius
    ? format(dateTimeData, `h:mmaaa`)
    : format(dateTimeData, `HH:mm`);

  feelsLikeText.textContent = isCelsius
    ? `${data.feelslike_f}°F`
    : `${data.feelslike_c}°C`;
}
