import React from 'react';
import './CartaoApp.css';

function CartaoApp() {
  return (
    <div className="card card-app">
      <h2>ProfSOS</h2>
      <button className="btn">Abrir chamado</button>
      <div className="historico-ultimo">
        <h4>Último chamado:</h4>
        <p className="status resolvido">Computador não liga - Resolvido</p>
      </div>
    </div>
  );
}

export default CartaoApp;
