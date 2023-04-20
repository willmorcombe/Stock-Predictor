import React, { useEffect, useState } from "react";

import Navbar from "../navbar/navbar.js";

export default function Hompage(props) {
  const [prediction_history_data, setPredictionData] = useState([]);

  const getOverallPredictionPercentage = () => {
    return (
      (prediction_history_data
        .map((d) => {
          return d.correct_prediction;
        })
        .filter(Boolean).length /
        prediction_history_data.map((d) => {
          return d.correct_prediction;
        }).length) *
      100
    ).toFixed(2);
  };

  const getStockData = () => {
    fetch("/stocks/stock_prediction_history_all")
      .then((response) => response.json())
      .then((api_data) => {
        setPredictionData(api_data);
      });
  };

  useEffect(() => {
    getStockData();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <section className="hompage-section">
          <div className="homepage-data">
            <h1 className="info-item">Stock Prediction</h1>
            <h2 className="info-item">Website Description</h2>
            <h7 className="description info-item">
              This website is a test to try and prove the illegitimacy of
              predicting stock trends on purely historical data. Below are nine
              stocks that have been tracked and a model has been trained on each
              stock to predict their closing day price using a simple LSTM. The
              below figure is a percentage of correct prediction (meaning did
              the stock go up when it was predicted to, or did the stock go down
              when it was predicted to).
            </h7>
            <h2 className="info-item">Total Correct Prediction Percentage</h2>
            <p
              style={{
                fontSize: "50px",
                color:
                  getOverallPredictionPercentage() >= 50
                    ? "var(--color-green)"
                    : "red",
              }}
            >
              {getOverallPredictionPercentage()}%
            </p>
          </div>
        </section>

        {/* <hr style={{ borderTop: "10px solid var(--color-primary)" }}></hr> */}
      </div>
    </>
  );
}
