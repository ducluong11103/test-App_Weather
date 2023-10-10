import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from '../Assets/search.png';
import cloud_icon from '../Assets/cloud.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';
import clear_icon from '../Assets/clear.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import drizzle_icon from '../Assets/drizzle.png';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('Đà Nẵng');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [icon, setIcon] = useState(cloud_icon);
  const apiKey = '995c91278c8a8690b179cc77a9587edf';

  const fetchWeatherData = async () => {
    try {
      if (!city) return;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`
      );
      const data = response.data;

      if (data.cod === 200) {
        setWeatherData(data);
        const weatherIcon = data.weather[0].icon;
        switch (weatherIcon) {
          case '01d':
          case '01n':
            setIcon(clear_icon);
            break;
          case '02d':
          case '02n':
            setIcon(cloud_icon);
            break;
          case '03d':
          case '03n':
            setIcon(drizzle_icon);
            break;
          case '04d':
          case '04n':
            setIcon(drizzle_icon);
            break;
          case '09d':
          case '09n':
            setIcon(rain_icon);
            break;
          case '10d':
          case '10n':
            setIcon(rain_icon);
            break;
          case '13d':
          case '13n':
            setIcon(snow_icon);
            break;
          default:
            setIcon(clear_icon);
        }
      } else {
        console.error('Error fetching weather data:', data.message);
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const fetchForecastData = async () => {
    try {
      if (!city) return;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=vi`
      );
      const data = response.data;

      if (data.cod === '200') {
        setForecastData(data.list);
        console.log(data);
      } else {
        console.error('Error fetching forecast data:', data.message);
        setForecastData([]);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setForecastData([]);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    fetchForecastData()
  }, [city]);

  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="search-icon" onClick={fetchWeatherData}>
          <img src={search_icon} alt="" />
        </div>
      </div>
      {weatherData ? (
        <>
          <div className="weather-image">
            <img src={icon} alt="" />
          </div>
          <div className="weather-temp">
            {weatherData.main.temp}°C
          </div>
          <div className="weather-location">{weatherData.name}</div>
          <div className="data-container">
            <div className="element">
              <img src={humidity_icon} alt="" />
              <div className="data">
                <div className="humidity-percent">
                  {weatherData.main.humidity}%
                </div>
                <div className="text">Humidity</div>
              </div>
            </div>
            <div className="element">
              <img src={wind_icon} alt="" />
              <div className="data">
                <div className="wind-rate">
                  {weatherData.wind.speed} km/h
                </div>
                <div className="text">Wind Speed</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/* <Forecast /> */}

      <h3>Thời gian tới:</h3>
    {forecastData.length > 0 && (
    <div className="forecast-container">
      {forecastData.slice(0, 5).map((forecast, index) => (
        <div key={index} className="forecast-item">
          <div className="forecast-date">
            {forecast.dt_txt.split(" ")[0]}
          </div>
          <div className="forecast-time">
            {new Date(forecast.dt_txt).toLocaleTimeString()}
          </div>
          <img
            src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
            alt={forecast.weather[0].description}
          />
          <div className="forecast-description">
            {forecast.weather[0].description}
          </div>
          <div className="forecast-temp">{forecast.main.temp}°C</div>
          
        </div>
      ))}
    </div>
  )}
    </div>
  );
};

export default WeatherApp;
