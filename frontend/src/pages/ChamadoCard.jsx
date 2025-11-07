import React from "react";
import "./ChamadoCard.css";

export default function ChamadoCard({ titulo, codigo, categoria, data, status, link }) {
  const getStatusClass = (status) => {
    if (status === "Pendente") return "status pendente";
    if (status === "Em Andamento") return "status andamento";
    if (status === "Resolvido") return "status resolvido";
    return "status";
  };

  return (
    <div className="chamado-card">
      <div className="chamado-info">
        <strong>{titulo}</strong>
        <span>{codigo}</span>
      </div>
      <div>{categoria}</div>
      <div>{data}</div>
      <span className={getStatusClass(status)}>{status}</span>
      <a href={link} className="ver-link">Ver</a>
    </div>
  );
}
