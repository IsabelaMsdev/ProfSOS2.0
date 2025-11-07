import React from "react";
import { useNavigate } from "react-router-dom";
import "./BasePage.css";

function BasePage({ title, subtitle, cards, buttonText, buttonRoute }) {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}

      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="step-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {buttonText && buttonRoute && (
        <div className="start-button-container">
          <button onClick={() => navigate(buttonRoute)}>{buttonText}</button>
        </div>
      )}
    </div>
  );
}

export default BasePage;
