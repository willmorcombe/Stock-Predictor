import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function Graph(props) {
  const [windowDimensions, setWindowDimensions] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimensions({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  const xAxisLabels = () => {
    const arrayUnique = (array) => {
      var a = array.concat();
      for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
          if (a[i] === a[j]) a.splice(j--, 1);
        }
      }
      return a;
    };

    let x_labels_prediction = props.stock_prediction_data.map((d) => {
      return d.date_time;
    });

    let x_labels_previous = props.stock_previous_data.map((d) => {
      return d.date_time;
    });

    const combined_x_labels = arrayUnique(
      x_labels_previous.concat(x_labels_prediction)
    );
    return combined_x_labels;
  };

  const graph_data = {
    labels: xAxisLabels().map((d) => {
      return (d.split("T")[0] + " " + d.split("T")[1]).split("Z")[0];
    }),
    datasets: [
      {
        label: "Prediction close of stock",
        data: new Array(
          xAxisLabels().length - props.stock_prediction_data.length
        )
          .fill(null)
          .concat(
            props.stock_prediction_data.map((d) => {
              return d.close;
            })
          ),
        backgroundColor: "rgba(232, 23, 93)",
        borderColor: "white",
        borderWidth: 5,
        pointBorderColor: "rgba(232, 23, 93)",
        pointRadius: 7,
        pointHoverRadius: 10,
      },
      {
        label: "Actual close of stock",
        data: props.stock_previous_data
          .map((d) => {
            return d.close;
          })
          .concat(
            new Array(
              xAxisLabels().length - props.stock_previous_data.length
            ).fill(null)
          ),
        backgroundColor: "purple",
        borderColor: "white",
        borderWidth: 5,
        pointBorderColor: "purple",
        pointRadius: 7,
        pointHoverRadius: 10,
      },
    ],
  };

  const graph_options = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Close Price " + props.stock_details.company_currency,
        },
        min:
          Math.min(
            ...graph_data.datasets[0].data
              .concat(graph_data.datasets[1].data)
              .filter(function (val) {
                return val !== null;
              })
          ) - 0.5,
        max:
          Math.max(
            ...graph_data.datasets[0].data.concat(graph_data.datasets[1].data)
          ) + 0.5,
        ticks: {
          color: "white",
          beginAtZero: true,
        },
        grid: {
          color: "#ffffff38",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date Time",
        },
        ticks: {
          color: "white",
          beginAtZero: true,
        },
        grid: {
          color: "#ffffff38",
        },
      },
    },
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  });

  return (
    <div
      style={{
        height: windowDimensions.winWidth / 2,
        width: "100%",
        minHeight: "600px",
        maxHeight: "1000px",
      }}
    >
      <Line data={graph_data} options={graph_options}></Line>
    </div>
  );
}
