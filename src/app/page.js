"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./randomwheel.module.css";
import axios from "axios";

const initialRestaurants = [];


export default function RandomWheel() {
  const canvasRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [chosenRestaurant, setChosenRestaurant] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const API_KEY = "xYMZRYtUiOGz90R5Lt3z7uAAJWaZb22L3hv4SKWs";
  const [listSuggestLocation, setListSuggestLocation] = useState();
  const [keyword, setKeyword] = useState("");

  const debounce = (func, wait) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  function randomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  const spinWheel = () => {
    if (!restaurants?.length) {
      alert("Please add restaurants");
    }

    if (isSpinning) return;
    setIsSpinning(true);

    const canvas = canvasRef.current;
    const spins = 5 + Math.random() * 5;
    const arc = (Math.PI * 2) / restaurants?.length;
    const spinAngle = Math.random() * Math.PI * 2;
    const totalRotation = spins * Math.PI * 2 + spinAngle;

    canvas.style.transform = `rotate(${totalRotation - Math.PI / 2}rad)`;

    const finalAngle = totalRotation % (Math.PI * 2);
    const selectedIndex = Math.floor(
      (restaurants?.length - finalAngle / arc) % restaurants?.length
    );

    setTimeout(() => {
      setChosenRestaurant(restaurants[selectedIndex]);
      setShowResult(true);
      setIsSpinning(false);
      setTimeout(() => setShowResult(false), 3000);
    }, 5000);
  };

  const addRestaurant = (value) => () => {
    const updatedRestaurants = [...restaurants, value];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };

  const deleteRestaurant = (index) => {
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };

  const fetchSuggesstLocation = async (keyword) => {
    const data = await axios.get(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${keyword}`
    );
    if (data.status === 200) {
      setListSuggestLocation(data.data.predictions);
    }
  };

  useEffect(() => {
    const savedRestaurants = localStorage.getItem("restaurants");
    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants));
    } else {
      setRestaurants(initialRestaurants);
      localStorage.setItem("restaurants", JSON.stringify(initialRestaurants));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    resizeCanvas();
    drawWheel();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);

    function resizeCanvas() {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawWheel();
    }
    function truncateText(text, maxWidth) {
      let truncated = text;
      while (ctx.measureText(truncated).width > maxWidth) {
        truncated = truncated.slice(0, -1);
      }
      return truncated.length < text.length ? truncated + '...' : truncated;
    }

    function drawWheel() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(Math.min(centerX, centerY) - 10, 0); // Ensure radius is non-negative
      const totalRestaurants = restaurants?.length;
      if (totalRestaurants === 0) return; // Handle case where there are no restaurants
      const arc = (Math.PI * 2) / totalRestaurants;
      for (let i = 0; i < totalRestaurants; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = randomHexColor();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#333";
        ctx.font = "bold 12px Arial";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        const maxTextWidth = radius * 0.7; // Adjust this value to change the maximum text width
        const truncatedText = truncateText(restaurants[i], maxTextWidth);

        ctx.strokeText(truncatedText, radius - 10, 5);
        ctx.fillText(truncatedText, radius - 10, 5);
        ctx.restore();
      }
    }
  }, [restaurants]); // Add restaurants as a dependency

  return (
    <div className={styles.body}>
      {restaurants.length ? <div className={`list-chosen ${restaurants.length > 8 ? "h-96 overflow-y-auto" : ""
        } `} style={{ backgroundColor: 'white' }}>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                List restaurants
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((name, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-900">{name}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded-md"
                    onClick={() => deleteRestaurant(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}

      <div className={styles.wheelContainer}>
        <div className={styles.selector}></div>
        <canvas ref={canvasRef} className={styles.wheel}></canvas>
        <button
          className={styles.wheelCenter}
          onClick={spinWheel}
          aria-label="Spin the wheel"
        >
          SPIN
        </button>
      </div>

      <div className="form-add-restaurant">
        <input
          placeholder="Search restaurant..."
          onChange={(e) => {
            setKeyword(e.target.value);
            debounce(() => {
              // fetchSuggesstLocation(e.target.value);
            }, 1000)();
          }}
        />
        {listSuggestLocation?.length > 0 && keyword.length > 0 && (
          <div className="list-locations">
            {listSuggestLocation.map((item, idx) => (
              <p
                key={idx}
                onClick={addRestaurant(item?.structured_formatting?.main_text)}
              >
                {item.description}
              </p>
            ))}
          </div>
        )}
      </div>
      <button onClick={fetchSuggesstLocation}>Search</button>
      <select onChange={(e) => addRestaurant(e)}>
        {listSuggestLocation?.length > 0 &&
          listSuggestLocation.map((item, index) => (
            <option key={index} value={item?.structured_formatting?.main_text}>
              {item.description}
            </option>
          ))}
      </select>
      <div
        className={`${styles.resultMessage} ${showResult ? styles.show : ""}`}
        role="alert"
        aria-live="polite"
      >
        <h1>
          <span className={styles.resultText}>Let's have</span>
          <br />
          <span className={styles.restaurantName}>{chosenRestaurant}</span>
          <br />
          <span className={styles.resultText}>tonight!</span>
        </h1>
      </div>
    </div>
  );
}
