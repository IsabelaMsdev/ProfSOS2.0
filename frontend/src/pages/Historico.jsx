import React from "react";
import { useNavigate } from "react-router-dom";
import "./Historico.css";

export default function Historico() {
  const navigate = useNavigate();

  const chamados = [
    { titulo: "Janela Quebrada na Sala 101", codigo: "#TKT-00124", categoria: "Manutenção", data: "20 de julho de 2025", status: "Pendente" },
    { titulo: "Torneira Vazando no Banheiro Masculino", codigo: "#TKT-00123", categoria: "Encanamento", data: "15 de julho de 2025", status: "Em Andamento" },
    { titulo: "Projetor Não Funciona na Biblioteca", codigo: "#TKT-00122", categoria: "Tecnologia", data: "10 de julho de 2025", status: "Resolvido" },
    { titulo: "Mau Funcionamento do Sistema de Aquecimento no Ginásio", codigo: "#TKT-00121", categoria: "AVAC", data: "5 de julho de 2025", status: "Resolvido" },
    { titulo: "Fechadura Quebrada na Entrada Principal", codigo: "#TKT-00120", categoria: "Segurança", data: "30 de junho de 2025", status: "Pendente" }
  ];

  const getStatusClass = (status) => {
    if (status === "Pendente") return "status pendente";
    if (status === "Em Andamento") return "status andamento";
    if (status === "Resolvido") return "status resolvido";
    return "status";
  };

  return (
    <div className="historico-container">
      <div className="historico-header">
        <h2>Chamados Anteriores</h2>
        <button className="novo-chamado" onClick={() => navigate("/registrar")}>+ Novo Chamado</button>
      </div>

      <div className="tabela-wrapper">
        <table className="historico-tabela">
          <thead>
            <tr>
              <th>Chamado</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((c, i) => (
              <tr key={i}>
                <td>
                  <div className="chamado-info">
                    <strong>{c.titulo}</strong>
                    <span>{c.codigo}</span>
                  </div>
                </td>
                <td>{c.categoria}</td>
                <td>{c.data}</td>
                <td>
                  <span className={getStatusClass(c.status)}>{c.status}</span>
                </td>
                <td>
                  <button className="ver-link" onClick={() => navigate("/status", { state: { chamado: c } })}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-voltar" onClick={() => navigate("/home")}>
        Voltar para Home
      </button>
    </div>
  );
}
