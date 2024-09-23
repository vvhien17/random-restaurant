"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./randomwheel.module.css";
import Search from "./components/Search";
import RestaurantList from "./components/RestaurantList";
import AddRestaurant from "./components/AddRestaurant";
import Wheel from "./components/Wheel";
import ResultMessage from "./components/ResultMessage";

const initialRestaurants = [];

export default function RandomWheel() {
  const [restaurants, setRestaurants] = useState([]);
  const [chosenRestaurant, setChosenRestaurant] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState('');
  const wheelRef = useRef(null);


  const spinWheel = () => {
    if (!restaurants?.length || restaurants?.length < 2) {
      alert("Please add more places");
      return;
    }
    if (isSpinning) return;
    setIsSpinning(true);
    const spins = 5 + Math.random() * 20;
    const arc = (Math.PI * 2) / restaurants?.length;
    const spinAngle = Math.random() * Math.PI * 2;
    const totalRotation = spins * Math.PI * 2 + spinAngle;
    wheelRef.current.rotateWheel(totalRotation);
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
            <button onClick={() => { setIsSearchActive('result'); }}
              className={`tab-button px-4 py-2 ${isSearchActive == 'result' ? "bg-blue-500 text-white" : ""} rounded-md`}
            >
              Your list
            </button>
            <button onClick={() => setIsSearchActive('search')}
              className={`tab-button px-4 py-2 ${isSearchActive == 'search' ? "bg-blue-500 text-white" : ""} rounded-md`}
            >Search Online</button>
            <button onClick={() => setIsSearchActive('add')}
              className={`tab-button px-4 py-2 ${isSearchActive == 'add' ? "bg-blue-500 text-white" : ""} rounded-md`}>
              Add name</button>
          </div>

          {/* Conditional rendering based on isSearchActive */}
          {isSearchActive === 'search' && (
            <Search
              setRestaurants={setRestaurants}
              restaurants={restaurants}
            />
          )}
          {isSearchActive === 'result' && restaurants.length > 0 && (
            <RestaurantList
              restaurants={restaurants}
              setRestaurants={setRestaurants}
              isSpinning={isSpinning}
            />
          )}
          {isSearchActive === 'add' && (
            <AddRestaurant
              setRestaurants={setRestaurants}
              restaurants={restaurants}
            />
          )}
        </div>

        <Wheel
          restaurants={restaurants}
          spinWheel={spinWheel}
          isSpinning={isSpinning}
          ref={wheelRef}
        />

        <ResultMessage
          showResult={showResult}
          chosenRestaurant={chosenRestaurant}
          setShowResult={setShowResult}
        />
      </div>
    </div>
  );
}
