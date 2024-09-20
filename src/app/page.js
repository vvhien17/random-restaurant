"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./randomwheel.module.css";
import axios from "axios";

const emailjs = require('emailjs-com');
const initialRestaurants = [];
emailjs.init(process.env.PUBLIC_SERVICE_KEY);


export default function RandomWheel() {
  const API_KEY = process.env.GOONG_MAP_API_KEY;
  const canvasRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [chosenRestaurant, setChosenRestaurant] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [listSuggestLocation, setListSuggestLocation] = useState();
  const [keyword, setKeyword] = useState("");
  const [isSearchActive, setIsSearchActive] = useState('add');
  const [name, setName] = useState('');
  const [time, setTime] = useState('tonight');

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const mealTime = () => {
    const time = new Date().getHours();
    if (time >= 6 && time < 10) {
      setTime("for the morning");
    } else if (time >= 10 && time < 14) {
      setTime("for lunch");
    } else if (time >= 14 && time < 18) {
      setTime("for the afternoon");
    }
    else {
      setTime("tonight");
    }
  }

  function randomHexColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  const spinWheel = () => {
    mealTime();
    if (!restaurants?.length || restaurants?.length < 2) {
      alert("Please add more restaurants");
      return;
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
      setChosenRestaurant(`${restaurants[selectedIndex].name}`);
      setShowResult(true);
      setIsSpinning(false);
    }, 5000);
  };

  const addRestaurant = (value) => async () => {
    const seleted = listSuggestLocation.filter(item => item.structured_formatting?.main_text == value);
    const geo = await axios.get(
      `https://rsapi.goong.io/geocode?place_id=${seleted[0].place_id}&api_key=${API_KEY}`
    );
    const newItem = {
      name: seleted[0].structured_formatting?.main_text,
      lat: geo.data.results[0].geometry.location.lat,
      lng: geo.data.results[0].geometry.location.lng,
      address: seleted[0].structured_formatting?.secondary_text,
    }
    const updatedRestaurants = [...restaurants, newItem];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };
  const addRestaurantName = (e) => {
    e.preventDefault();
    const nameList = name.split('\n').map(item => item.trim()).filter(item => item);
    if (!nameList.length) return;
    const newItems = nameList.map(item => ({ name: item, address: '', lat: '', lng: '' }));
    const updatedRestaurants = [...restaurants, ...newItems];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setName('');
  }

  const deleteRestaurant = (index) => {
    if (isSpinning) return;
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
      const restaurants = JSON.parse(savedRestaurants);
      setRestaurants(restaurants);
      setIsSearchActive(restaurants.length > 0 ? 'result' : 'add');
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
      return truncated.length < text.length ? truncated + "..." : truncated;
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
        const truncatedText = truncateText(restaurants[i].name, maxTextWidth);

        ctx.strokeText(truncatedText, radius - 10, 5);
        ctx.fillText(truncatedText, radius - 10, 5);
        ctx.restore();
      }
    }

  }, [restaurants]); // Add restaurants as a dependency



  return (
    <div className="bg-[#baf2f5]">
      <div className="items-center justify-between text-center p-2">
        <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-sky-400">
          Foodie Roulette And Fun
        </h1>
      </div>
      <div
        className={`${styles.body} px-4 md:px-16 lg:px-24 max-xl:flex-col-reverse`}
      >
        <div className="min-h-[400px] max-h-[400px] w-[343px] md:w-[500px] text-xs md:text-sm lg:text-lg">
          {/* Tab Navigation */}
          <div className="tabs text-black flex p-4 gap-6">
            <button
              className={`tab-button px-4 py-2 ${isSearchActive == 'result' ? "bg-blue-500 text-white" : ""} rounded-md`}
              onClick={() => { setIsSearchActive('result'); setListSuggestLocation([]) }}
            >
              Restaurants list
            </button>
            <button
              className={`tab-button px-4 py-2 ${isSearchActive == 'search' ? "bg-blue-500 text-white" : ""} rounded-md`}
              onClick={() => setIsSearchActive('search')}
            >
              Search Online
            </button>
            <button
              className={`tab-button px-4 py-2 ${isSearchActive == 'add' ? "bg-blue-500 text-white" : ""} rounded-md`}
              onClick={() => setIsSearchActive('add')}
            >
              Add name
            </button>
          </div>

          {/* Search Section */}
          {isSearchActive == 'search' && (
            <div className="form-add-restaurant mt-4 h-full items-center justify-center">
              <input
                placeholder="Search restaurant..."
                onChange={(e) => {
                  setKeyword(e.target.value);
                  debounce(() => {
                    fetchSuggesstLocation(e.target.value);
                  }, 3000)();
                }}
                className="border p-2 w-full"
              />
              {listSuggestLocation?.length > 0 && keyword.length > 0 && (
                <div className="list-locations">
                  {listSuggestLocation.map((item, idx) => (
                    <p
                      key={idx}
                      onClick={addRestaurant(item?.structured_formatting?.main_text)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {item.description}
                    </p>
                  ))}
                </div>
              )}
            </div>

          )}

          {/* List Section */}
          {isSearchActive == 'result' && restaurants.length > 0 && (
            <div className="restaurant-list mt-4">

              <p className="text-lg font-semibold border-b border-gray-400 p-4">
                List of Restaurants
              </p>

              <div className="grid max-h-[50vh] overflow-auto">
                {restaurants.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-6 p-4 border-b"
                  >
                    <p className="text-sm text-gray-900">{item.name}</p>
                    <button
                      className="px-4 py-2 text-white bg-red-400 rounded-md"
                      onClick={() => deleteRestaurant(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Add Name Section */}
          {isSearchActive == 'add' && (
            <div className="items-center justify-center gap-4 flex">
              <textarea
                className="border rounded-md w-3/5 p-3 focus-visible:outline-none"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter names here..."
                rows="5"
                cols="50"
              />
              <button
                className="border p-2 w-1/5 bg-blue-500 text-white rounded-md"
                onClick={addRestaurantName}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div className={`${styles.wheelContainer} shrink-0`}>
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
            <span className={styles.resultText}>{time}!</span>
          </h1>
          <div className="result-buttons mt-4">
            <button
              className="px-4 py-2 bg-red-300 text-white rounded-md"
              onClick={() => {
                setShowResult(false);
              }}
            >
              Close
            </button>
          </div>
        </div>

      </div >
    </div>
  );
}
