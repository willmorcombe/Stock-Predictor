import React, { Component } from "react";
import Homepage from "./components/homepage/homepage.js";
import Stock from "./components/stock/stock.js";
import Stocks from "./components/stocks/stocks.js";
import About from "./components/about/about.js";
import "../static/css/index.css";
import ScrollToTop from "./components/scroll/ScrollToTop.js";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stock/:stock_id" element={<Stock />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    );
  }
}
