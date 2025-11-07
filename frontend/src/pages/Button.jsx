import React from "react";
import "./Button.css";

export default function Button({ children, onClick, disabled }) {
  return (
    <button className="custom-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
