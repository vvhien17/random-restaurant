import React, { useRef, useEffect } from "react";
import styles from "../randomwheel.module.css";

const Wheel = ({ restaurants, isSpinning, spinWheel }) => {
  const canvasRef = useRef(null);

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

    function randomHexColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    }

    function drawWheel() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(Math.min(centerX, centerY) - 10, 0);
      const totalRestaurants = restaurants?.length;
      if (totalRestaurants === 0) return;
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
        const maxTextWidth = radius * 0.7;
        const truncatedText = truncateText(restaurants[i].name, maxTextWidth);
        ctx.strokeText(truncatedText, radius - 10, 5);
        ctx.fillText(truncatedText, radius - 10, 5);
        ctx.restore();
      }
    }

    function truncateText(text, maxWidth) {
      let truncated = text;
      while (ctx.measureText(truncated).width > maxWidth) {
        truncated = truncated.slice(0, -1);
      }
      return truncated.length < text.length ? truncated + "..." : truncated;
    }
  }, [restaurants]);

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.selector}></div>
      <canvas ref={canvasRef} className={styles.wheel}></canvas>
      <button
        className={styles.wheelCenter}
        onClick={spinWheel}
        aria-label="Spin the wheel"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

export default Wheel;
