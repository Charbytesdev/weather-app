import "./scss/style.scss";
import { format } from "date-fns";
import getById from "./ts/util";
const [searchBar, searchButton, location, date, time, weatherText] = getById(
  "search-bar",
  "search-button",
  "location",
  "date",
  "time",
  "weather-text"
) as HTMLElement[];

(searchButton as HTMLButtonElement).onclick = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
    );
    const weatherData = await response.json();
    const dateTimeData = new Date(weatherData.location.localtime);
    date.textContent = format(dateTimeData, `eeee, do MMM ''yy`);
    console.log(date);
    time.textContent = format(dateTimeData, `h:mmaaa`);
    location.textContent = weatherData.location.name;
    weatherText.textContent = weatherData.current.condition.text;
  } catch (error) {
    console.log(error);
  }
};
