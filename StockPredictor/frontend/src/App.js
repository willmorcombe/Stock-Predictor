import React, { Component } from "react";
import Homepage from "./components/homepage/homepage.js";
import Stock from "./components/stock/stock.js";
import "../static/css/index.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/stock/:stock_id" element={<Stock />} />
        </Routes>
      </Router>
    );
  }
}
