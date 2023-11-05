/* eslint-disable @typescript-eslint/naming-convention */
import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";

type CurrentDay = {
  temp_c: string;
  temp_f: string;
  feelslike_c: string;
  feelslike_f: string;
  wind_kph: string;
  wind_mph: string;
};

type ForecastDay = {
  date: string;
  day: MINMAXTemperatures;
};

type MINMAXTemperatures = {
  maxtemp_c: string;
  maxtemp_f: string;
  mintemp_c: string;
  mintemp_f: string;
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

function getNextDayTemps(forecastDays: ForecastDay[], property: string) {
  return forecastDays
    .slice(1)
    .map(
      (forecastDay: ForecastDay) =>
        forecastDay.day[property as keyof MINMAXTemperatures]
    );
}

function swapTodayTemps(
  current: CurrentDay,
  isCelsius: boolean,
  localtime: string
) {
  temperatureText.textContent = isCelsius
    ? `${current.temp_f} °F`
    : `${current.temp_c} °C`;

  const dateTimeData = new Date(localtime);
  timeText.textContent = isCelsius
    ? format(dateTimeData, `h:mm aaa`)
    : format(dateTimeData, `HH:mm`);

  feelsLikeText.textContent = isCelsius
    ? `${current.feelslike_f} °F`
    : `${current.feelslike_c} °C`;

  windSpeedText.textContent = isCelsius
    ? `${current.wind_mph} mph`
    : `${current.wind_kph} km/h`;
}

function swapNextDaysTemps(isCelsius: boolean, forecastDays: ForecastDay[]) {
  const maxCelsiusTemps = getNextDayTemps(forecastDays, "maxtemp_c");

  const maxFahrenheitTemps = getNextDayTemps(forecastDays, "maxtemp_f");

  const minCelsiusTemps = getNextDayTemps(forecastDays, "mintemp_c");

  const minFahrenheitTemps = getNextDayTemps(forecastDays, "mintemp_f");

  [day1MAXTemp.textContent, day2MAXTemp.textContent] = isCelsius
    ? maxFahrenheitTemps
    : maxCelsiusTemps;

  [day1MINTemp.textContent, day2MINTemp.textContent] = isCelsius
    ? minFahrenheitTemps
    : minCelsiusTemps;
}

function swapTemperatures(
  current: CurrentDay,
  forecastDays: ForecastDay[],
  localTime: string
) {
  const currentTemp = temperatureText.textContent?.split("°")[1];
  const isCelsius = currentTemp === "C";
  swapTodayTemps(current, isCelsius, localTime);
  swapNextDaysTemps(isCelsius, forecastDays);
  temperatureSwapButton.textContent = isCelsius ? "Display °C" : "Display °F";
}

async function getWeather(city: string = "london") {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=360903de59304a0ea59113502232010&days=3&q=${city}`
    );
    const {
      forecast: { forecastday: forecastDays },
      current,
      current: {
        humidity,
        condition: { icon, text },
      },
      location: { name, localtime: localTime },
    } = await response.json();
    const dateTimeData = new Date(localTime);
    (weatherImg as HTMLImageElement).src = icon;
    weatherText.textContent = text;
    locationText.textContent = name;
    dateText.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    swapTemperatures(current, forecastDays, localTime);
    temperatureSwapButton.onclick = () =>
      swapTemperatures(current, forecastDays, localTime);
    humidityText.textContent = `${humidity}%`;
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

(searchButton as HTMLButtonElement).onclick = async () =>
  getWeather((searchBarInput as HTMLInputElement).value);

getWeather();
