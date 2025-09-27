import React from 'react';
import './CartaoStatus.css';

function CartaoStatus() {
  const etapas = [
    { nome: 'Recebido', status: '✔️' },
    { nome: 'Em andamento', status: '⏳' },
    { nome: 'Resolvido', status: '✔️' },
  ];

  return (
    <div className="card card-status">
      <h3>Status do chamado</h3>
      <ul className="etapas">
        {etapas.map((etapa, index) => (
          <li key={index}>
            <span>{etapa.status}</span> {etapa.nome} - Sala 5: Computador não liga
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartaoStatus;
