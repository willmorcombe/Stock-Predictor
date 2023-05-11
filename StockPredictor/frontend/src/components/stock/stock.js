import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Graph from "./graph.js";
import History from "./history.js";
import Navbar from "../navbar/navbar.js";
import Footer from "../footer/footer.js";

export default function Stock() {
  const [stock_details, setStockDetails] = useState([]);
  const [stock_prediction_data, setPredictionData] = useState([]);
  const [stock_previous_data, setPrevData] = useState([]);
  const [stock_prediction_history, setPredictionHistory] = useState([]);

  const { stock_id } = useParams();
  const navigate = useNavigate();

  const getAllStockData = () => {
    fetch("/stocks/stock_details_single=" + stock_id)
      .then((response) => response.json())
      .then((api_data) => {
        setStockDetails(api_data);
      });

    fetch("/stocks/stock_prediction_day=" + stock_id)
      .then((response) => response.json())
      .then((api_data) => {
        setPredictionData(api_data);
      });

    fetch("/stocks/stock_data_day=" + stock_id)
      .then((response) => response.json())
      .then((api_data) => {
        setPrevData(api_data);
      });

    fetch("/stocks/stock_prediction_history=" + stock_id)
      .then((response) => response.json())
      .then((api_data) => {
        setPredictionHistory(api_data);
      });
  };

  // calculating the perentage change of the stock
  const getStockPriceChange = (data) => {
    if (data[0]) {
      return (
        ((data[0].close - data[data.length - 1].close) / data[0].close) * 100 -
        ((data[0].close - data[data.length - 1].close) / data[0].close) *
          100 *
          2
      ).toFixed(2);
    }
    return null;
  };
  // console.log(stock_prediction_data);
  // functiion to return true or false depending on whether its the beggining of a new day
  const isNewDay = () => {
    return !stock_prediction_data
      .map((d) => d.date_time)
      .filter((element) =>
        stock_previous_data.map((d) => d.date_time).includes(element)
      ).length
      ? true
      : false;
  };

  useEffect(() => {
    getAllStockData();
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <Navbar />
        <section id="homepage-stocks" className="stocks-section">
          <h1 className="stock-title">{stock_details.company_name}</h1>
          <h5>Inudstry</h5>
          <h2 className="stock-title-secondary">
            {stock_details.company_industry}
          </h2>

          <div className="stock-info">
            <h5 className="stock-info-item">Company Information</h5>
            <h7 className="stock-info-item description">
              {stock_details.company_description}
            </h7>
            <div className="stock-info-item stock-info-details">
              <div className="stock-info-details-item">
                <h7>Company Location: </h7>
                <h7 style={{ color: "var(--color-primary)" }}>
                  {stock_details.company_country}
                </h7>
              </div>
              <div className="stock-info-details-item">
                <h7>Company Currency: </h7>
                <h7 style={{ color: "var(--color-primary)" }}>
                  {stock_details.company_currency}
                </h7>
              </div>
              <div className="stock-info-details-item">
                <h7>Company Ticker: </h7>
                <h7 style={{ color: "var(--color-primary)" }}>
                  {stock_details.ticker}
                </h7>
              </div>
            </div>
          </div>

          <div className="stock-data">
            <h5 className="stock-data-item">Company Data</h5>

            <h2 className="stock-data-graph-title stock-data-item">
              Graph Showing Predicted / Realtime Close Values
            </h2>

            <Graph
              className="stock-data-item"
              stock_prediction_data={stock_prediction_data}
              stock_previous_data={stock_previous_data}
              stock_details={stock_details}
            />

            <h2 className="stock-data-item stock-data-graph-title">
              Stock Analytics Today
            </h2>

            <h7
              className="stock-data-item"
              style={{ color: "var(--color-light)" }}
            >
              Data gets refreshed daily from 2:30 GMT
            </h7>

            <div className="stock-data-analytics">
              <div className="stock-data-analytics-item">
                <div className="stock-data-analytics-item-details">
                  <h7>Predicted Change</h7>
                  <p
                    className="stock-data-analytics-percentage"
                    style={{
                      color:
                        getStockPriceChange(stock_prediction_data) < 0.0
                          ? "red"
                          : "var(--color-green)",
                    }}
                  >
                    {getStockPriceChange(stock_prediction_data)}%
                  </p>
                </div>
                <div className="stock-data-analytics-item-details">
                  <h7>Actual Change</h7>
                  <p
                    className="stock-data-analytics-percentage"
                    style={{
                      color: isNewDay()
                        ? "white"
                        : getStockPriceChange(stock_previous_data) < 0.0
                        ? "red"
                        : "var(--color-green)",
                    }}
                  >
                    {isNewDay()
                      ? "NA"
                      : getStockPriceChange(stock_previous_data) + "%"}
                  </p>
                </div>
              </div>
              <div className="stock-data-analytics-item">
                <div className="stock-data-analytics-item-details">
                  <h7>Correct day Prediction?</h7>
                  <p
                    style={{
                      fontSize: "30px",
                      color: isNewDay()
                        ? "white"
                        : (getStockPriceChange(stock_previous_data) < 0.0 &&
                            getStockPriceChange(stock_prediction_data) < 0.0) ||
                          (getStockPriceChange(stock_previous_data) > 0.0 &&
                            getStockPriceChange(stock_prediction_data) > 0.0)
                        ? "var(--color-green)"
                        : "red",
                    }}
                  >
                    {isNewDay()
                      ? "NA"
                      : (getStockPriceChange(stock_previous_data) < 0.0 &&
                          getStockPriceChange(stock_prediction_data) < 0.0) ||
                        (getStockPriceChange(stock_previous_data) > 0.0 &&
                          getStockPriceChange(stock_prediction_data) > 0.0)
                      ? "CORRECT"
                      : "INCORRECT"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <History
            stock_prediction_history={stock_prediction_history}
            stock_details={stock_details}
          />
          <div className="stock-button">
            <a
              className="btn btn-primary"
              onClick={() => {
                navigate("/");
              }}
            >
              Homepage
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
