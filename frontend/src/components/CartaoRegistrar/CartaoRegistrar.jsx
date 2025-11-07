import React from 'react';
import './CartaoRegistrar.css';

function CartaoRegistrar() {
  const categorias = ['Tecnológico', 'Manutenção', 'Limpeza', 'Materiais'];

  return (
    <div className="card card-registrar">
      <h3>Registrar problema</h3>
      <ul className="categorias">
        {categorias.map((cat, index) => (
          <li key={index}>
            <span className="icone">🔹</span>
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartaoRegistrar;
