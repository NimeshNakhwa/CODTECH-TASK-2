import React, { useState, useEffect } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const apiKey = "3b8d96fbc5b688632820ff3880957e02"; 


  const fetchWeather = async () => {
    setLoading(true);
    setError("");

    let url = "";

    if (city) {

      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (latitude && longitude) {

      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    }

    if (!url) return;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        setError("City not found. Please try again.");
        setWeatherData(null);
      } else if (data.cod === 200) {
        setWeatherData(data);
      } else {
        setError("Error fetching weather data.");
        setWeatherData(null);
      }
    } catch (err) {
      setError("Error fetching weather data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (city || (latitude && longitude)) {
      fetchWeather();
    }
  }, [city, latitude, longitude]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => setError("Unable to retrieve location")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
