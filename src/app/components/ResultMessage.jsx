import React, { useState } from "react";
import styles from "../randomwheel.module.css";

const ResultMessage = ({ showResult, chosenRestaurant, setShowResult }) => {

  const mealTime = () => {
    const time = new Date().getHours();
    if (time >= 6 && time < 10) {
      return "for the morning";
    } else if (time >= 10 && time < 14) {
      return "for lunch";
    } else if (time >= 14 && time < 18) {
      return "for the afternoon";
    }
    else {
      return "tonight";
    }
  }

  return (
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
        <span className={styles.resultText}>{mealTime()}!</span>
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
  );
};

export default ResultMessage;
