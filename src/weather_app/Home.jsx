import "./home.css";
import React, { useEffect, useState, useReducer } from "react";

const key = "613aa23ad39bb430d6adbb8be993a1cf";

const initialState = {
  loading: true,
  dataLoaded: false,
  err: false,
  error: "",
  weatherData: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        err: false,
        loading: false,
        dataLoaded: true,
        weatherData: action.payload,
      };
    case "FETCH_ERROR":
      return {
        err: true,
        loading: false,
        dataLoaded: false,
        weatherData: action.payload,
      };
    default:
      return state;
  }
};

export const Home = ({ title }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [city, setCity] = useState("zomba");

  useEffect(() => {
    getWeather();
  }, []);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  const getWeather = async () => {
    try {
      const results = await fetch(url);
      const data = await results.json();
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          temperature: data.main.temp,
          country: data.sys.country,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          location: data.name,
          icon: data.weather[0].icon,
          dt: data.dt,
          timezone: data.timezone,
        },
      });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: `no data available` });
    }
  };

  const { temperature, country, humidity, description, location, icon } =
    state.weatherData;

  return (
    <section className="container">
      <div className="card">
        <h2>{title}</h2>
        <div className="search">
          <input
            type="text"
            placeholder="search city"
            value={city}
            className="input"
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="button" onClick={getWeather}>
            search
          </button>
        </div>
        {state.err ? (
          <div className="error">
            <h2>{state.weatherData}</h2>
          </div>
        ) : (
          state.dataLoaded && (
            <>
              <div className="location">
                <h2>
                  {location}, {country}
                </h2>
              </div>
              <img
                src={`http://openweathermap.org/img/w/${icon}.png`}
                alt="icon"
                className="icon"
              />
              <div className="temp">
                <h1>{Math.round(temperature - 273.15)}</h1>
                <span>&deg;</span>
                <span>C</span>
              </div>
              <div className="description">
                <h2>{description}</h2>
                <p>humidity: {humidity}%</p>
              </div>
            </>
          )
        )}
      </div>
    </section>
  );
};
