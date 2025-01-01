import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import search from "../assets/search.png";
import location_icon from "../assets/location.png";
import location_marker from "../assets/location_marker.png";
import wind from "../assets/wind.png";
import rain from "../assets/rain.png";
import sunrise from "../assets/sunrise.png";
import sunset from "../assets/sunset.png";
import SliderArrow from "../components/SliderArrow/SliderArrow";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

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
      await fetchHourlyForecast(
        response.data.coord.lat,
        response.data.coord.lon
      );
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

  const fetchHourlyForecast = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${apiKey}`
      );
      setHourlyForecast(response.data.hourly.slice(1, 14));
    } catch (err) {
      setError("Failed to fetch hourly forecast data", err);
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
        zoom: 11,
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 3,
    adaptiveHeight: false,
    variableWidth: true,
    centerMode: false,
    nextArrow: <SliderArrow />,
    prevArrow: <SliderArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

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
            {hourlyForecast && (
              <div className={styles.hourly_forecast_container}>
                <Slider {...settings}>
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className={styles.hourly_forecast_item}>
                      <p>
                        {new Date(hour.dt * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                        alt={hour.weather[0].description}
                      />
                      <h2>{hour.temp.toFixed(1)}°C</h2>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            <div className={styles.main_map} ref={mapRef}></div>
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
                  Min <i className="fa-solid fa-arrow-down"></i>
                </h2>
                <p>{weather.main.temp_min.toFixed(1)}°C</p>
              </div>
              <hr></hr>
              <div className={styles.max_min_temp}>
                <h2>
                  Max <i className="fa-solid fa-arrow-up"></i>
                </h2>
                <p>{weather.main.temp_max.toFixed(1)}°C</p>
              </div>
            </div>
            <div className={styles.details_item}>
              <div>
                <img src={wind} alt="Wind Image" />
              </div>
              <div>
                <h2>
                  Wind speed:{" "}
                  <span style={{ opacity: 0.7 }}>
                    {weather.wind.speed.toFixed(1)} m/s
                  </span>
                </h2>
                <h2>
                  Wind direction:{" "}
                  <span style={{ opacity: 0.7 }}>{weather.wind.deg}&deg;</span>
                </h2>
              </div>
            </div>
            <div className={styles.details_item}>
              <div>
                <img src={rain} alt="Rain Image" />
              </div>
              <div>
                <h2>
                  Rain Volume:{" "}
                  <span style={{ opacity: 0.7 }}>
                    {weather.rain ? weather.rain["1h"] : 0} mm
                  </span>
                </h2>
                {weather.snow && <h2>Snow: {weather.snow["1h"]} mm</h2>}
              </div>
            </div>
            <div className={styles.details_item}>
              <div>
                <h2>Humidity</h2>
                <p>{weather.main.humidity}%</p>
              </div>
              <hr></hr>
              <div>
                <h2>Pressure</h2>
                <p>{weather.main.pressure} hPa</p>
              </div>
            </div>
            <div className={styles.details_item}>
              <div>
                <h2>Cloudiness</h2>
                <p>{weather.clouds.all}%</p>
              </div>
              <hr></hr>
              <div>
                <h2>Visibility</h2>
                <p>{weather.visibility} m</p>
              </div>
            </div>
            <div className={styles.details_item}>
              <div>
                <img src={sunrise} alt="Sunrise Image" />
                <span>
                  <h2>Sunrise</h2>
                  <p>
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </p>
                </span>
              </div>
              <div>
                <img src={sunset} alt="Sunset Image" />
                <span>
                  <h2>Sunset</h2>
                  <p>
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
