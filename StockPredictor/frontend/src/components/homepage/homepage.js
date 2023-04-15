import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import background_image from "../../../static/images/background-image.jpg";

export default function Hompage(props) {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
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
    fetch("/stocks/stock_details_list")
      .then((response) => response.json())
      .then((api_data) => {
        {
          setData(api_data);
        }
      });

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
            below figure is a percentage of correct prediction (meaning did the
            stock go up when it was predicted to, or did the stock go down when
            it was predicted to).
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

      <hr style={{ borderTop: "10px solid var(--color-primary)" }}></hr>
      <section id="homepage-stocks" className="stocks-section">
        <div className="stock-header-divider"></div>

        <h5>Avalible Stocks</h5>
        <h2>Stocks</h2>
        <div className="container stocks-container">
          {/* loop through all stock's in database and display a link to them */}
          {data.map((d) => (
            <article className="stocks-item">
              <h3>{d.company_name}</h3>
              <div className="stocks-item-button">
                <a
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/stock/" + d.id);
                  }}
                >
                  Analyse Stock
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
