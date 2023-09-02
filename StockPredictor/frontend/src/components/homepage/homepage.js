import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar.js";
import Footer from "../footer/footer.js";

export default function Hompage(props) {
  const [prediction_history_data, setPredictionData] = useState([]);
  const [hot_stocks_data, setHotStocks] = useState([]);
  const [prediction_history_data_week, setPredictionDataWeek] = useState([]);
  const [prediction_day_percetnages, setPredictionDayPercetnages] = useState(
    []
  );

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

    fetch("/stocks/stock_prediction_day_percentages")
      .then((response) => response.json())
      .then((api_data) => {
        setPredictionDayPercetnages(api_data);
      });
  };

  useEffect(() => {
    getStockData();
  }, []);

  console.log(
    prediction_day_percetnages.map((d) => {
      return d["positive"][1];
    })
  );
  return (
    <div className="page">
      <div className="page-content">
        <Navbar />
        <div>
          <section className="hompage-section">
            <div className="page-data">
              <h1 className="info-item">Stock Prediction</h1>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                  width: "100%",
                }}
              >
                <div className="page-article">
                  <h2 className="info-item">Stocks To Look Out For Today</h2>
                  <div className="statistics-today-div">
                    <div className="statistics-today-item">
                      <h7>Stocks predicted on the up</h7>
                      <div className="statistics-today-item-list">
                        <div className="statistics-today-item-list-item">
                          <p style={{ color: "var(--color-primary)" }}>
                            {prediction_day_percetnages.map((d) => {
                              return d["positive"][0][0];
                            })}
                          </p>
                          <p
                            style={{
                              fontSize: "50px",
                              color: "var(--color-green)",
                            }}
                          >
                            {parseFloat(
                              prediction_day_percetnages.map((d) => {
                                return d["positive"][0][1];
                              })
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div className="statistics-today-item-list-item">
                          <p style={{ color: "var(--color-primary)" }}>
                            {prediction_day_percetnages.map((d) => {
                              return d["positive"][1][0];
                            })}
                          </p>
                          <p
                            style={{
                              fontSize: "50px",
                              color: "var(--color-green)",
                            }}
                          >
                            {parseFloat(
                              prediction_day_percetnages.map((d) => {
                                return d["positive"][1][1];
                              })
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr
                      className="statistics-divide"
                      style={{ borderTop: "10px solid var(--color-primary)" }}
                    ></hr>
                    <div className="statistics-today-item">
                      <h7>Stocks predicted on the down</h7>
                      <div className="statistics-today-item-list">
                        <div className="statistics-today-item-list-item">
                          <p style={{ color: "var(--color-primary)" }}>
                            {prediction_day_percetnages.map((d) => {
                              return d["negative"][0][0];
                            })}
                          </p>
                          <p
                            style={{
                              fontSize: "50px",
                              color: "red",
                            }}
                          >
                            {parseFloat(
                              prediction_day_percetnages.map((d) => {
                                return d["negative"][0][1];
                              })
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div className="statistics-today-item-list-item">
                          <p style={{ color: "var(--color-primary)" }}>
                            {prediction_day_percetnages.map((d) => {
                              return d["negative"][1][0];
                            })}
                          </p>
                          <p
                            style={{
                              fontSize: "50px",
                              color: "red",
                            }}
                          >
                            {parseFloat(
                              prediction_day_percetnages.map((d) => {
                                return d["negative"][1][1];
                              })
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="page-article">
                  <h2 className="info-item">Stocks Statistics General</h2>
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
                          {getOverallPredictionPercentage(
                            prediction_history_data
                          )}
                          %
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
                              parseFloat(
                                hot_stocks_data.map((d) => {
                                  return d.all_time.percentage;
                                })[0]
                              ).toFixed(1) >= 50
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
                              parseFloat(
                                hot_stocks_data.map((d) => {
                                  return d.weekly.percentage;
                                })[0]
                              ).toFixed(1) >= 50
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
            </div>
          </section>

          {/* <hr style={{ borderTop: "10px solid var(--color-primary)" }}></hr> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
