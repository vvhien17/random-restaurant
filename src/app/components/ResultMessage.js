import React from "react";
import styles from "../randomwheel.module.css";

const ResultMessage = ({ showResult, chosenRestaurant, time, setShowResult }) => {
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
  );
};

export default ResultMessage;
