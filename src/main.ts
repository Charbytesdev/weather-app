import "./scss/style.scss";
import searchBar from "./ts/searchBar";
import searchButton from "./ts/searchButton";
import weatherText from "./ts/weatherText";
import location from "./ts/location";

(searchButton as HTMLButtonElement).onclick = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
    );

    const weatherData = await response.json();
    console.log(weatherData);
    location.textContent = weatherData.location.name;
    weatherText.textContent = weatherData.current.condition.text;
  } catch (error) {
    console.log(error);
  }
};
