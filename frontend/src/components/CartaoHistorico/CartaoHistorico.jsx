import React from 'react';
import './CartaoHistorico.css';

function CartaoHistorico() {
  const historico = [
    { descricao: 'Computador não liga', status: 'Resolvido' },
    { descricao: 'Luzes não acendem', status: 'Em andamento' },
    { descricao: 'Falta de giz', status: 'Recebido' },
  ];

  return (
    <div className="card card-historico">
      <h3>Histórico de chamados</h3>
      <ul>
        {historico.map((item, index) => (
          <li key={index}>
            {item.descricao} - <strong>{item.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartaoHistorico;
