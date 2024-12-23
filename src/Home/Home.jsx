import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import search from "../assets/search.png";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = "08c166350cc8024625e3df240b998376";

  const fetchWeather = async () => {
    const loc = location.trim() || "Bucharest";
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&lang=en&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setSuggestions([]);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (e) => {
    if (e.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const respone = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${e}&limit=5&appid=${apiKey}`
      );
      setSuggestions(respone.data.slice(0, 5));
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  const handleSuggestionClick = (suggestions) => {
    setLocation(suggestions.name);
    setSuggestions([]);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <section className={styles.home_container}>
      <h1 className={styles.title}>weatherly</h1>
      <h2 className={styles.subtitle}>
        the only weather app you will ever need
      </h2>
      <div className={styles.search_container}>
        <div className={styles.search_bar}>
          <input
            type="text"
            value={location}
            placeholder="Search location"
            onChange={(e) => {
              setLocation(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          ></input>
          <div className={styles.search_button} onClick={fetchWeather}>
            <img src={search} alt="search" />
          </div>
        </div>
        <ul className={styles.suggestions_list}>
          {suggestions.map((suggestions, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestions)}
              className={styles.suggestion_item}
            >
              {suggestions.name},
              {suggestions.state !== undefined
                ? ` ${suggestions.state}, `
                : " "}
              {suggestions.country}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.whitespace}>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      <div className={styles.weather_container}>123</div>
    </section>
  );
};

export default Home;
