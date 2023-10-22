import "./scss/style.scss";
import searchBar from "./ts/searchBar";
import searchButton from "./ts/searchButton";
import weatherText from "./ts/weatherText";
import location from "./ts/location";

(searchButton as HTMLButtonElement).onclick = async () => {
  try {
    const weatherPromise = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
    );

    const weatherPromiseJSON = await weatherPromise.json();
    location.textContent = weatherPromiseJSON.location.name;
    weatherText.textContent = weatherPromiseJSON.current.condition.text;
  } catch (error) {
    console.log(error);
  }
};
