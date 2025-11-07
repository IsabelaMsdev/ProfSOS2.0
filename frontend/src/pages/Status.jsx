import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaCheck, FaTools, FaBell } from 'react-icons/fa'; // Ícones para a timeline
import "./Status.css";

// Novo componente para a Timeline (Timeline Visual do Status)
const StatusTimeline = ({ chamadoStatus }) => {
    const etapas = [
        { status: "Recebido", title: "Chamado Recebido", description: "O sistema registrou sua solicitação." },
        { status: "Em Andamento", title: "Em Análise/Suporte", description: "O chamado foi encaminhado à equipe responsável e está em tratamento." },
        { status: "Resolvido", title: "Concluído", description: "O problema foi resolvido. Agradecemos o contato." }
    ];

    const statusMap = {
        "Recebido": 0,
        "Em Andamento": 1,
        "Resolvido": 2,
    };
    const currentStatusIndex = statusMap[chamadoStatus] || 0;

    const getTimelineClass = (index) => {
        let classes = `timeline-item ${etapas[index].status.toLowerCase().replace(' ', '-')}`;
        if (index < currentStatusIndex) {
            classes += ' complete';
        } else if (index === currentStatusIndex) {
            classes += ' active';
        }
        return classes;
    }

    const getIcon = (status) => {
        if (status === "Recebido") return <FaBell size={12} />;
        if (status === "Em Andamento") return <FaTools size={12} />;
        if (status === "Resolvido") return <FaCheck size={12} />;
        return null;
    }

    return (
        <div className="status-timeline">
            {etapas.map((etapa, index) => (
                <div key={etapa.status} className={getTimelineClass(index)}>
                    <div className="timeline-dot">
                        {/* Se completo, usa o check; senão, usa o ícone da etapa */}
                        {index < currentStatusIndex ? <FaCheck size={12} /> : getIcon(etapa.status)}
                    </div>
                    <div className="timeline-content">
                        <h4>{etapa.title}</h4>
                        <p>{etapa.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Status() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados mockados ou passados pela navegação
  const chamado = location.state?.chamado || {
    titulo: "Projetor Quebrado na Sala 203",
    codigo: "#12345",
    status: "Em Andamento", // Status para teste
    descricao: "Seu chamado está sendo analisado pela equipe de suporte técnico. O técnico irá à sala 203 amanhã de manhã.",
  };

  const [comentarios, setComentarios] = useState([
    { autor: "Usuário", texto: "O projetor parou de funcionar hoje cedo." },
    { autor: "Suporte Técnico", texto: "Estamos verificando o problema." },
  ]);

  const [novoComentario, setNovoComentario] = useState("");

  const adicionarComentario = () => {
    if (novoComentario.trim() === "") return;
    setComentarios([
      ...comentarios,
      {
        autor: "Usuário",
        texto: novoComentario.trim(),
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setNovoComentario("");
  };

  return (
    <div className="status-container">
      <div className="status-card">
        <div className="status-header">
          <h2>Status do Chamado</h2>
          <span>{chamado.titulo} ({chamado.codigo})</span>
        </div>
        
        {/* Timeline Visual - Novo componente */}
        <StatusTimeline chamadoStatus={chamado.status} /> 

        <div className="chamado-descricao">
            <strong>Descrição do Chamado:</strong>
            {chamado.descricao}
        </div>

        {/* Comentários */}
        <div className="status-comentarios">
          <h3>Comentários</h3>
          <TransitionGroup>
            {comentarios.map((comentario, index) => (
              <CSSTransition key={index} timeout={300} classNames="fade">
                <div className="comentario" tabIndex={0}>
                  <strong>
                    {comentario.autor === "Usuário" ? "👤" : "🛠️"} {comentario.autor}:
                  </strong>{" "}
                  <span>{comentario.texto}</span>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>

        {/* Novo Comentário */}
        <div className="status-novo-comentario">
          <textarea
            placeholder="Adicionar comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            aria-label="Campo para adicionar novo comentário"
          />
          <button
            onClick={adicionarComentario}
            disabled={novoComentario.trim() === ""}
            aria-disabled={novoComentario.trim() === ""}
          >
            Enviar Comentário
          </button>
        </div>

        {/* Botão de voltar */}
        <button
          className="btn-voltar"
          onClick={() => navigate("/historico")}
          aria-label="Voltar para Histórico de Chamados"
        >
          Voltar para Histórico
        </button>
      </div>
    </div>
  );
}