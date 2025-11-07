import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FaHome, FaCheckCircle } from 'react-icons/fa'; 
import "./Registrar.css";

export default function Registrar() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [formVisible, setFormVisible] = useState(true);
  const [chamadoInfo, setChamadoInfo] = useState(null); // Armazena dados do chamado para card de sucesso

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock dos dados de sucesso (substitua por chamada à API)
    const novoChamado = {
      titulo,
      categoria,
      descricao,
      status: "Recebido",
      codigo: "#TKT-" + Math.floor(Math.random() * 900 + 100), 
    };

    console.log("Chamado enviado:", novoChamado);
    setChamadoInfo(novoChamado);
    setFormVisible(false);

    // No projeto real, a navegação seria após a resposta da API.
  };

  const redirectToStatus = () => {
    // Navega para a página de status, passando as informações do chamado
    navigate("/status", { state: { chamado: chamadoInfo } });
  }

  return (
    <div className="registrar-container">
      {/* Botão flutuante para voltar à home, agora com ícone */}
      <button
        className="btn-float-home"
        title="Voltar para Home"
        onClick={() => navigate("/home")}
      >
        <FaHome />
      </button>

      {/* Formulário - Aparece se formVisible for true */}
      <CSSTransition in={formVisible} timeout={300} classNames="fade" unmountOnExit>
        <div className="registrar-card">
          <h2>Novo Chamado</h2>
          <form onSubmit={handleSubmit} className="registrar-form">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Segurança">Segurança</option>
            </select>

            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              placeholder="Descreva o problema em detalhes"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            ></textarea>

            <button type="submit" className="btn-enviar">Enviar Chamado</button>
          </form>
        </div>
      </CSSTransition>

      {/* Card de Sucesso - Aparece se formVisible for false */}
      <CSSTransition in={!formVisible} timeout={300} classNames="fade" unmountOnExit>
        <div className="registrar-card success-card">
            <FaCheckCircle size={50} color="#10b981" style={{ marginBottom: '20px' }} />
            <h3>Chamado Registrado!</h3>
            <p>Seu chamado foi enviado com sucesso e será analisado pela equipe de suporte.</p>
            
            <strong>Código do Chamado: {chamadoInfo?.codigo}</strong>
            <strong>Título: {chamadoInfo?.titulo}</strong>

            <button 
                onClick={redirectToStatus} 
                className="btn-enviar" 
            >
                Acompanhar Status
            </button>
        </div>
      </CSSTransition>

    </div>
  );
}