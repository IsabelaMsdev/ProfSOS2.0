import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({ steps, currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
