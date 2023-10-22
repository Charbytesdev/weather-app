import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";
const [
  searchBar,
  searchButton,
  location,
  date,
  time,
  temperature,
  weatherText,
] = getById(
  "search-bar",
  "search-button",
  "location",
  "date",
  "time",
  "temperature",
  "weather-text"
) as HTMLElement[];

(searchButton as HTMLButtonElement).onclick = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
    );
    const weatherData = await response.json();
    location.textContent = weatherData.location.name;
    const dateTimeData = new Date(weatherData.location.localtime);
    date.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    time.textContent = format(dateTimeData, `h:mmaaa`);
    weatherText.textContent = weatherData.current.condition.text;
    temperature.textContent = `${weatherData.current.temp_c}°C`;
  } catch (error) {
    console.log(error);
  }
};
