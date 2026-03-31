import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState(null);

  // 🔥 AUTO STATUS (ANY PLACE)
  const getAutoStatus = (city) => {
    if (city.length > 6) return "high";
    return "low";
  };

  // 🔹 TIME SUGGESTION
  const getTimeSuggestion = () => {
    const hour = new Date().getHours();

    if (hour >= 8 && hour <= 12) return "Morning rush time";
    if (hour >= 13 && hour <= 18) return "Afternoon moderate crowd";
    return "Evening / Night less crowded";
  };

  // 🔹 FETCH DATA
  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/data");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🌡 WEATHER
  const getWeather = (city) => {
    return {
      temp: 25 + city.length,
      condition: "Normal",
    };
  };

  // 🔹 SEND DATA
  const sendData = async () => {
    if (!place) return;

    const autoStatus = getAutoStatus(place);
    setStatus(autoStatus);

    await fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ place, status: autoStatus }),
    });

    setWeather(getWeather(place));
    fetchData();

    // 🔥 CLEAR INPUT
    setPlace("");
    setStatus("");
  };

  // 🔹 DELETE
  const deleteData = async (id) => {
    await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  // 🔹 UPDATE
  const updateToHigh = async (id) => {
    await fetch(`http://localhost:5000/update/${id}`, {
      method: "PUT",
    });
    fetchData();
  };

  return (
    <div className="container">
      <h1 className="title">Smart Crowd Prediction System</h1>

      <div className="card">
        <input
          placeholder="Enter Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />

        <input placeholder="Status (auto)" value={status} readOnly />

        <button onClick={sendData}>Check</button>
      </div>

      {/* 🔥 SMART OUTPUT */}
      {place && (
        <div className="result-card">
          {status === "high" ? (
            <p className="warning">⚠ Crowd is HIGH</p>
          ) : (
            <p className="low">✅ Crowd is LOW</p>
          )}

          {weather && (
            <div className="weather">
              🌡 {weather.temp}°C | {weather.condition}
            </div>
          )}

          <p className="recommend">
            {status === "high"
              ? "Avoid peak hours"
              : "Safe to visit"}
          </p>

          <p className="time">{getTimeSuggestion()}</p>
        </div>
      )}

      <h3 className="data-title">Saved Data</h3>

      <p>Total Places: {data.length}</p>

      {data.map((item) => (
        <div key={item._id} className="data-card">
          <p>
            {item.place} -{" "}
            {item.status === "high" ? "🔴 HIGH" : "🟢 LOW"}
          </p>

          <button onClick={() => deleteData(item._id)}>Delete</button>
          <button onClick={() => updateToHigh(item._id)}>
            Make High
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;