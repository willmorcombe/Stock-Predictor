import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar.js";
import Footer from "../footer/footer.js";

export default function About() {
  return (
    <div className="page">
      <div className="page-content">
        <Navbar />
        <div>
          <section>
            <div className="page-data about-main-container">
              <h1 className="info-item">About This App</h1>

              <div className="page-article">
                <div className="about-article-content">
                  <h2>General App Purpose</h2>
                  <h7 className="description">
                    This website is a test to try and prove the illegitimacy of
                    predicting stock trends on purely historical data (as
                    hopefully you can see from prediction statistics). There are
                    <b style={{ color: "var(--color-primary" }}> nine </b> test
                    stocks that have been added to test on which you can explore
                    and see the relevant prediction data. Each stock has{" "}
                    <b style={{ color: "var(--color-primary" }}>two</b> years
                    worth of historical data that is stored for training
                    purposes.
                  </h7>
                </div>
              </div>

              <div className="page-article">
                <div className="about-article-content">
                  <h2>The Data</h2>
                  <h7 className="description">
                    The data is sent by{" "}
                    <a href="https://uk.finance.yahoo.com/">yahoo finance</a>{" "}
                    every hour (from when the market opens to when it closes).
                    This includes data like:{" "}
                    <b style={{ color: "var(--color-white" }}>
                      Opening value, High, Low, Close, Adj Close, Volume, Date
                      Time.
                    </b>{" "}
                    Each model is then trained on their respective data. As the
                    data gets send every hour, the data is in invertals of one
                    hour.
                  </h7>
                </div>
              </div>
              <div className="about-article-container">
                <div className="page-article">
                  <div className="about-article-content">
                    <h2>ML Model</h2>
                    <h7 className="description">
                      A model is created for each stock, and trained on its two
                      years of historical data. These models are trained at the
                      end and its predictions are stored. The ML model that is
                      used is an{" "}
                      <b style={{ color: "var(--color-primary" }}>LSTM</b>{" "}
                      trained with tensorflow. The input only uses the{" "}
                      <b style={{ color: "var(--color-primary" }}>
                        closing value
                      </b>{" "}
                      of the respective stock, along with the a look back value
                      that specifies how many hour of data to send to the model.
                      Other parameters include an{" "}
                      <b style={{ color: "var(--color-primary" }}>MSE</b> loss
                      function and an{" "}
                      <b style={{ color: "var(--color-primary" }}>ADAM</b>{" "}
                      optimzer.
                    </h7>
                  </div>
                </div>
                <div className="page-article">
                  <div className="about-article-content">
                    <h2>Correct Predictions Explaination</h2>
                    <h7 className="description">
                      At the end of each (working) day, a comparison will be
                      made to see if the prediction was "correct". This
                      basically means that if the model predicted that the
                      closing price would go down that day, and this was also
                      shown in the actual stock closing value, then a{" "}
                      <b style={{ color: "var(--color-primary" }}>correct</b>{" "}
                      prediction would be displayed. An{" "}
                      <b style={{ color: "var(--color-primary" }}>incorrect</b>{" "}
                      prediction is when the models day prediction for a stock
                      doesn't match the actual day movement of that stock.
                    </h7>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
