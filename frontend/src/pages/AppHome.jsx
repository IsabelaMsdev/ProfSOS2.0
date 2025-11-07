import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importar useLocation para destaque da sidebar
// Ícones profissionais (usando um conjunto mais variado e moderno)
import { FaPlusSquare, FaChartBar, FaHistory, FaSignOutAlt } from "react-icons/fa"; 
import './AppHome.css';

function AppHome() {
  const navigate = useNavigate();
  const location = useLocation(); // Para destacar o item ativo

  // Botões que vão na sidebar
  const menuButtons = [
    { label: "Registrar Chamado", path: "/registrar", icon: <FaPlusSquare /> }, // Ícone atualizado
    { label: "Status do Chamado", path: "/status", icon: <FaChartBar /> }, // Ícone atualizado
    { label: "Histórico", path: "/historico", icon: <FaHistory /> } // Ícone atualizado
  ];

  // Cards que vão no conteúdo principal, agora com o path de navegação
  const cards = [
    {
      title: "Registrar um chamado",
      description: "Abra um novo chamado para reportar problemas ou solicitar suporte.",
      icon: <FaPlusSquare size={36} />, // Ícone visual
      path: "/registrar" // Adicionar o caminho
    },
    {
      title: "Acompanhe o status",
      description: "Veja em tempo real o andamento dos seus chamados abertos.",
      icon: <FaChartBar size={36} />, // Ícone visual
      path: "/status" // Adicionar o caminho
    },
    {
      title: "Histórico de chamados",
      description: "Consulte chamados anteriores e seus respectivos desfechos.",
      icon: <FaHistory size={36} />, // Ícone visual
      path: "/historico" // Adicionar o caminho
    }
  ];

  return (
    <div className="home-container">
      {/* Sidebar lateral com botões + ícones */}
      <aside className="sidebar">
        <h2 className="logo">ProfSOS</h2> {/* Logo/Título */}
        
        {/* Links de navegação */}
        <nav className="sidebar-nav">
          {menuButtons.map(({ label, path, icon }, i) => (
            <button 
              key={i} 
              onClick={() => navigate(path)} 
              className={`sidebar-btn ${location.pathname === path ? 'active' : ''}`} // Destaque para página ativa
            >
              <span className="icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Botão de Logout */}
        <button className="logout-btn" onClick={() => navigate("/")}>
          <FaSignOutAlt />
          Sair
        </button>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header>
          <h1>Painel Principal</h1>
          <p>Seja bem-vindo(a)! Escolha uma das opções abaixo para começar.</p>
        </header>

        {/* Cards de destaque - AGORA CLICÁVEIS */}
        <section className="cards">
          {cards.map(({ title, description, icon, path }, i) => (
            <article 
              key={i} 
              className="card" 
              onClick={() => navigate(path)} // Adicionar a navegação aqui
              tabIndex={0} // Torna o card focável para acessibilidade
              role="button" // Indica que é um elemento clicável
            >
              <div className="card-icon">{icon}</div> {/* Mostrar o ícone */}
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default AppHome;