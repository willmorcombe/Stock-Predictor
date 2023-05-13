import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiSocialLinkedinCircular } from "react-icons/Ti";
import { ImMail4 } from "react-icons/Im";
import { BsGithub } from "react-icons/Bs";
import { RxDotFilled } from "react-icons/Rx";
import { AiOutlineCopyrightCircle } from "react-icons/Ai";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-items">
        <div className="footer-icons">
          <a href="https://www.linkedin.com/in/will-morcombe-bb59411a3/">
            <TiSocialLinkedinCircular
              href="www.linkedin.com"
              className="icon"
              style={{ fontSize: "54px" }}
            />
          </a>
          <a href="mailto: wtmorco@live.co.uk">
            <ImMail4 className="icon" />
          </a>
          <a href="https://github.com/willmorcombe">
            <BsGithub className="icon" />
          </a>
        </div>
        <div className="footer-links">
          <a
            className="footer-link"
            onClick={() => {
              navigate("/");
            }}
          >
            Homepage
          </a>
          <RxDotFilled style={{ color: "black", fontSize: "12px" }} />
          <a
            className="footer-link"
            onClick={() => {
              navigate("/stocks");
            }}
          >
            Test Stocks
          </a>
          <RxDotFilled style={{ color: "black", fontSize: "12px" }} />
          <a
            className="footer-link"
            onClick={() => {
              navigate("/about");
            }}
          >
            About
          </a>
        </div>
        <div className="footer-copyright">
          <AiOutlineCopyrightCircle
            style={{ color: "black", fontWeight: "500", opacity: "0.8" }}
          />
          <p style={{ opacity: "0.8", color: "black", fontWeight: "500" }}>
            {new Date().getFullYear()} Will Morcombe
          </p>
        </div>
      </div>
    </footer>
  );
}
