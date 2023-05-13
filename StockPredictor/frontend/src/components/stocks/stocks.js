import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar.js";
import Footer from "../footer/footer.js";

export default function Stocks() {
  const [detailsData, setDetailsData] = useState([]);
  const navigate = useNavigate();

  const getStockData = () => {
    fetch("/stocks/stock_details_list")
      .then((response) => response.json())
      .then((api_data) => {
        {
          setDetailsData(api_data);
        }
      });
  };
  useEffect(() => {
    getStockData();
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <Navbar />
        <h1>TESTING STOCKS PAGE</h1>

        <section id="homepage-stocks" className="stocks-section">
          <div className="stock-header-divider"></div>

          <h5>Avalible Stocks</h5>
          <h2>Stocks</h2>
          <div className="container stocks-container">
            {/* loop through all stock's in database and display a link to them */}
            {detailsData.map((d) => (
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
      <Footer />
    </div>
  );
}
