import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("nav-menu-contents");
  const [icon, setIcon] = useState("nav-toggler");
  const [icon_fixed, setIconFixed] = useState("");

  const navToggle = () => {
    active === "nav-menu-contents"
      ? setActive("nav-menu-contents nav-active")
      : setActive("nav-menu-contents");

    icon === "nav-toggler"
      ? setIcon("nav-toggler toggle")
      : setIcon("nav-toggler");

    icon_fixed === "" ? setIconFixed("icon-active") : setIconFixed("");
  };

  return (
    <header>
      <div className="nav-contents">
        <h2 className="nav-title">Stock Predictor App</h2>

        <nav className={icon_fixed}>
          <div className={active}>
            <a
              className="nav-button"
              onClick={() => {
                navigate("/");
              }}
            >
              HOMEPAGE
            </a>
            <a
              className="nav-button"
              onClick={() => {
                navigate("/stocks");
              }}
            >
              TEST STOCKS
            </a>
            <a
              className="nav-button"
              onClick={() => {
                navigate("/about");
              }}
            >
              ABOUT
            </a>
          </div>

          <div onClick={navToggle} className={icon}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </nav>
      </div>
    </header>
  );
}
