"use client";

import { useState, useEffect , useRef } from "react";
import axios from "axios";
import Wheel from "./components/wheel";
import RestaurantList from "./components/RestaurantList";
import Search from "./components/Search";
import AddRestaurant from "./components/AddRestaurant";
import ResultMessage from "./components/resultMessage";
import styles from "./randomwheel.module.css";

const initialRestaurants = [];

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

  const addRestaurantName = (e) => {
    e.preventDefault();
    const nameList = name.split('\n').map(item => item.trim()).filter(item => item);
    if (!nameList.length) return;
    const newItems = nameList.map(item => ({ name: item, address: '', lat: '', lng: '' }));
    const updatedRestaurants = [...restaurants, ...newItems];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setName('');
  };

  // 
  
  const spinWheel = () => {
    mealTime();
    if (!restaurants?.length || restaurants?.length < 2) {
      alert("Please add more places");
      return;
    }

    if (isSpinning) return;
    setIsSpinning(true);

    const canvas = canvasRef.current;
    const spins = 5 + Math.random() * 20;
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

  // Remaining functions for handling logic

  return (
    <div className="bg-[#baf2f5]">
      <div className="items-center justify-between text-center p-2">
        <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-sky-400">
          Foodie Roulette And Fun
        </h1>
      </div>
      <div className={`${styles.body} px-4 md:px-16 lg:px-24 max-xl:flex-col-reverse`}>
        <div className="min-h-[400px] max-h-[400px] w-[343px] md:w-[500px] text-xs md:text-sm lg:text-lg">
          {/* Tab Navigation */}
          <div className="tabs text-black flex p-4 gap-6">
            <button onClick={() => { setIsSearchActive('result'); setListSuggestLocation([]) }}>
              Your list
            </button>
            <button onClick={() => setIsSearchActive('search')}>Search Online</button>
            <button onClick={() => setIsSearchActive('add')}>Add name</button>
          </div>

          {/* Conditional rendering based on isSearchActive */}
          {isSearchActive === 'search' && (
            <Search 
              keyword={keyword}
              setKeyword={setKeyword}
              fetchSuggesstLocation={fetchSuggesstLocation}
              listSuggestLocation={listSuggestLocation}
              addRestaurant={addRestaurant}
            />
          )}
          {isSearchActive === 'result' && restaurants.length > 0 && (
            <RestaurantList 
              restaurants={restaurants}
              deleteRestaurant={deleteRestaurant}
            />
          )}
          {isSearchActive === 'add' && (
            <AddRestaurant 
              name={name}
              setName={setName}
              addRestaurantName={addRestaurantName}
            />
          )}
        </div>

        <Wheel 
          restaurants={restaurants}
          isSpinning={isSpinning}
          spinWheel={spinWheel}
        />
        
        <ResultMessage 
          showResult={showResult}
          chosenRestaurant={chosenRestaurant}
          time={time}
          setShowResult={setShowResult}
        />
      </div>
    </div>
  );
}
