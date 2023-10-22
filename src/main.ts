import "./scss/style.scss";
import searchBar from "./ts/searchBar";
import searchButton from "./ts/searchButton";

(searchButton as HTMLButtonElement).onclick = async () => {
  const weatherPromise = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=360903de59304a0ea59113502232010&q=${searchBar.value}`
  );

  const weatherPromiseJSON = await weatherPromise.json();
  console.log(weatherPromiseJSON.current.condition.text);
};
