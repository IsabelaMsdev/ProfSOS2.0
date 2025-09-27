import React from 'react';
import './App.css';
import CartaoApp from './components/CartaoApp';
import CartaoRegistrar from './components/CartaoRegistrar';
import CartaoStatus from './components/CartaoStatus';
import CartaoHistorico from './components/CartaoHistorico';

function App() {
  return (
    <div className="app-container">
      <CartaoApp />
      <CartaoRegistrar />
      <CartaoStatus />
      <CartaoHistorico />
    </div>
  );
}

export default App;
