import React from "react";
import "./Odometer.css";

function Odometer({ value, minDigits = 5 }) {
  const safeValue = value ?? 0;

  const digits = Math.max(
    String(safeValue).length,
    minDigits
  );

  const str = String(safeValue)
    .padStart(digits, "0")
    .split("");

  return (
    <div className="odometer">
      {str.map((digit, i) => (
        <div className="odometer-digit" key={i}>
          <div
            className="odometer-wheel"
            style={{ transform: `translateY(-${digit * 10}%)` }}
          >
            {[...Array(10).keys()].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Odometer;
