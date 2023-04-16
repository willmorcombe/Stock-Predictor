import React, { useEffect, useState } from "react";

export default function History(props) {
  const allTimeCorrectPredictions = () => {
    return (
      (props.stock_prediction_history
        .map((d) => {
          return d.correct_prediction;
        })
        .filter(Boolean).length /
        props.stock_prediction_history.map((d) => {
          return d.correct_prediction;
        }).length) *
      100
    ).toFixed(2);
  };

  return (
    <div className="stock-history">
      <h5 className="stock-data-history-title stock-data-item">
        {props.stock_details.company_name}'s Stock Prediction History
      </h5>
      <h2 className="stock-data-graph-title">
        Correct Prediction Percentage Since{" "}
        <b>
          {props.stock_prediction_history.length
            ? props.stock_prediction_history[0]["day"].split("T")[0]
            : null}
        </b>
      </h2>
      <p
        style={{
          fontSize: "50px",
          color:
            allTimeCorrectPredictions() > 50 ? "var(--color-green)" : "red",
        }}
      >
        {allTimeCorrectPredictions()}%
      </p>

      <h2 className="stock-data-graph-title stock-data-item">
        Table Showing All Stock History
      </h2>

      <table className="stock-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Correct Prediction?</th>
            <th>Actual Stock Close</th>
            <th>Predicted Stock Close</th>
          </tr>
        </thead>
        <tbody>
          {props.stock_prediction_history.map((array) => {
            return (
              <tr>
                <td>{array["day"].split("T")[0]}</td>
                <td>{array["correct_prediction"] == true ? "YES" : "NO"}</td>
                <td> {array["actual_end_close"].toFixed(2)} </td>
                <td> {array["prediction_end_close"].toFixed(2)} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
