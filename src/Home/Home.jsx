import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import axios from "axios";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <section className={styles.home_container}>
      <h1 className={styles.title}>weatherly</h1>
      <input
        type="text"
        value={location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        onKeyPress={handleKeyPress}
      ></input>
      <button onClick={fetchWeather}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temp: {weather.main.temp} &deg;C</p>
          <p>Max Temp: {weather.main.temp_max} &deg;C</p>
          <p>Min Temp: {weather.main.temp_min} &deg;C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </section>
  );
};

export default Home;
