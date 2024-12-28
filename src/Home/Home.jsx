import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import search from "../assets/search.png";
import location_icon from "../assets/location.png";
import location_marker from "../assets/location_marker.png";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null);

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
      setCoords({
        lat: response.data.coord.lat,
        lng: response.data.coord.lon,
      });
      setSuggestions([]);
      await fetchForecast();
    } catch (err) {
      setError("Failed to fetch weather data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    const loc = location.trim() || "Bucharest";
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${apiKey}&units=metric`
      );
      const dailyData = response.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);
    } catch (err) {
      setError("Failed to fetch forecast data", err);
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
      setSuggestions([], err);
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

  useEffect(() => {
    if (coords && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 12,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        styles: [
          {
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      new window.google.maps.Marker({
        position: coords,
        map,
        icon: {
          url: location_marker,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    }
  }, [coords]);

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
      {weather && (
        <div className={styles.weather_container}>
          <div className={styles.main}>
            <div className={styles.main_weather}>
              <div className={styles.weather_stats}>
                <div className={styles.weather_location}>
                  <img src={location_icon} alt="search" />
                  <p>{weather.name}</p>
                </div>
                <div className={styles.weather_temp}>
                  <p>
                    {weather.main.temp.toFixed(1)}
                    °C
                  </p>
                </div>
                <div className={styles.weather_description}>
                  <p>{weather.weather[0].description}</p>
                </div>
              </div>
              <div className={styles.weather_img}>
                {" "}
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            </div>
            <div className={styles.main_map} ref={mapRef}>
              123
            </div>
          </div>
          <div className={styles.forecast}>
            {forecast && (
              <div className={styles.forecast_container}>
                <h2 className={styles.forecast_title}>5-Day Forecast</h2>
                <div className={styles.forecast_list}>
                  {forecast.map((day, index) => (
                    <div key={index} className={styles.forecast_item}>
                      <div className={styles.forecast_p1}>
                        <h2>
                          {new Date(day.dt_txt).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </h2>
                        <p>{day.weather[0].description}</p>
                      </div>

                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt={day.weather[0].description}
                        className={styles.forecast_img}
                      />
                      <div className={styles.forecast_p2}>
                        <p>{day.main.temp.toFixed(1)}°C</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.details}>
            <div className={styles.details_item}>
              <div className={styles.feels_like}>
                <h2>Feels like</h2>
                <p>{weather.main.feels_like.toFixed(1)}°C</p>
              </div>
              <hr></hr>
              <div className={styles.max_min_temp}>
                <h2>
                  Min <i class="fa-solid fa-arrow-down"></i>
                </h2>
                <p>{weather.main.temp_min.toFixed(1)}°C</p>
              </div>
              <hr></hr>
              <div className={styles.max_min_temp}>
                <h2>
                  Max <i class="fa-solid fa-arrow-up"></i>
                </h2>
                <p>{weather.main.temp_max.toFixed(1)}°C</p>
              </div>
            </div>
            <div className={styles.details_item}>Humidity,Pressure</div>
            <div className={styles.details_item}>Wind speed,direction</div>
            <div className={styles.details_item}>Rain</div>
            <div className={styles.details_item}>Cloudiness,visibility</div>
            <div className={styles.details_item}>Sunrise/Sunset</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
