import React from 'react';
import './App.css';
import CartaoApp from './components/OcorrenciaForm/OcorrenciaForm';
import CartaoRegistrar from './components/OcorrenciaList/OcorrenciaList';
import CartaoStatus from './components/OcorrenciaList/OcorrenciaList';
import CartaoHistorico from './components/OcorrenciaList/OcorrenciaList';

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
