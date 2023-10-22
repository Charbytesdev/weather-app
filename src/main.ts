import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";

type apiTempData = {
  temp_c: string;
  temp_f: string;
};

const [
  searchBar,
  searchButton,
  weatherText,
  locationText,
  dateText,
  timeText,
  temperatureText,
  temperatureSwapButton,
] = getById(
  "search-bar",
  "search-button",
  "weather-text",
  "location",
  "date",
  "time",
  "temperature",
  "swap-temperature"
) as HTMLElement[];

(searchButton as HTMLButtonElement).onclick = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
    );
    const weatherData = await response.json();
    const dateTimeData = new Date(weatherData.location.localtime);

    weatherText.textContent = weatherData.current.condition.text;
    locationText.textContent = weatherData.location.name;
    dateText.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    timeText.textContent = format(dateTimeData, `h:mmaaa`);
    temperatureText.textContent = `${weatherData.current.temp_c}°C`;
    temperatureSwapButton.textContent = "Display °F";
    temperatureSwapButton.onclick = () => swapTemperatures(weatherData.current);
  } catch (error) {
    console.log(error);
  }
};

function swapTemperatures(data: apiTempData) {
  const currentTemp = temperatureText.textContent?.split("°")[1];
  const isCelsius = currentTemp == "C";

  temperatureText.textContent = isCelsius
    ? `${data.temp_f}°F`
    : `${data.temp_c}°C`;

  temperatureSwapButton.textContent = isCelsius ? "Display °C" : "Display °F";
}
