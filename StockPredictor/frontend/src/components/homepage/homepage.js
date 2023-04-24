import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar.js";

export default function Hompage(props) {
  const [prediction_history_data, setPredictionData] = useState([]);
  const [hot_stocks_data, setHotStocks] = useState([]);
  const [prediction_history_data_week, setPredictionDataWeek] = useState([]);

  const navigate = useNavigate();

  const getOverallPredictionPercentage = (history_data) => {
    return (
      (history_data
        .map((d) => {
          return d.correct_prediction;
        })
        .filter(Boolean).length /
        history_data.map((d) => {
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

    fetch("/stocks/stock_hot_stocks")
      .then((response) => response.json())
      .then((api_data) => {
        setHotStocks(api_data);
      });

    fetch("/stocks/stock_prediction_history_week")
      .then((response) => response.json())
      .then((api_data) => {
        setPredictionDataWeek(api_data);
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
          <div className="page-data">
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
            <div className="page-article">
              <h2 className="info-item">Test Stocks Statistics</h2>
              <div className="statistics-div">
                <div className="statistics-item">
                  <div className="overall-percentage">
                    <h7>Overall Correct Prediction</h7>
                    <p
                      style={{
                        fontSize: "50px",
                        color:
                          getOverallPredictionPercentage(
                            prediction_history_data
                          ) >= 50
                            ? "var(--color-green)"
                            : "red",
                      }}
                    >
                      {getOverallPredictionPercentage(prediction_history_data)}%
                    </p>
                  </div>
                  <div className="hot-stocks">
                    <h7>Overall Hot Stock</h7>
                    <p
                      className="hot-stock-link"
                      onClick={() => {
                        navigate(
                          "/stock/" +
                            hot_stocks_data.map((d) => {
                              return d.all_time.id;
                            })[0]
                        );
                      }}
                      style={{
                        fontSize: "50px",
                      }}
                    >
                      {
                        hot_stocks_data.map((d) => {
                          return d.all_time.ticker;
                        })[0]
                      }
                    </p>
                  </div>

                  <div className="hot-stocks">
                    <h7>
                      {hot_stocks_data.map((d) => {
                        return d.all_time.ticker;
                      })[0] + " "}{" "}
                      Overall Correct Prediction
                    </h7>
                    <p
                      style={{
                        fontSize: "50px",
                        color:
                          getOverallPredictionPercentage(
                            prediction_history_data
                          ) >= 50
                            ? "var(--color-green)"
                            : "red",
                      }}
                    >
                      {parseFloat(
                        hot_stocks_data.map((d) => {
                          return d.all_time.percentage;
                        })[0]
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
                <hr
                  className="statistics-divide"
                  style={{ borderTop: "10px solid var(--color-primary)" }}
                ></hr>
                <div className="statistics-item">
                  <div className="weekly-percentage">
                    <h7>Weekly Correct Prediction</h7>
                    <p
                      style={{
                        fontSize: "50px",
                        color:
                          getOverallPredictionPercentage(
                            prediction_history_data_week
                          ) >= 50
                            ? "var(--color-green)"
                            : "red",
                      }}
                    >
                      {getOverallPredictionPercentage(
                        prediction_history_data_week
                      )}
                      %
                    </p>
                  </div>
                  <div className="hot-stocks">
                    <h7>Weekly Hot Stock</h7>
                    <p
                      className="hot-stock-link"
                      onClick={() => {
                        navigate(
                          "/stock/" +
                            hot_stocks_data.map((d) => {
                              return d.weekly.id;
                            })[0]
                        );
                      }}
                      style={{
                        fontSize: "50px",
                      }}
                    >
                      {
                        hot_stocks_data.map((d) => {
                          return d.weekly.ticker;
                        })[0]
                      }
                    </p>
                  </div>

                  <div className="hot-stocks">
                    <h7>
                      {hot_stocks_data.map((d) => {
                        return d.weekly.ticker;
                      })[0] + " "}
                      Weekly Correct Prediction
                    </h7>
                    <p
                      style={{
                        fontSize: "50px",
                        color:
                          getOverallPredictionPercentage(
                            prediction_history_data_week
                          ) >= 50
                            ? "var(--color-green)"
                            : "red",
                      }}
                    >
                      {parseFloat(
                        hot_stocks_data.map((d) => {
                          return d.weekly.percentage;
                        })[0]
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-article-button">
                <a
                  onClick={() => {
                    navigate("/about");
                  }}
                  className="btn btn-primary"
                >
                  How are these statistics measured?
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* <hr style={{ borderTop: "10px solid var(--color-primary)" }}></hr> */}
      </div>
    </>
  );
}
