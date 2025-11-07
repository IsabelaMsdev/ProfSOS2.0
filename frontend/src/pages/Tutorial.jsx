import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Tutorial.css';

function Tutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Passo 1: Login', description: 'Faça login com suas credenciais para acessar o sistema.' },
    { title: 'Passo 2: Home', description: 'Na página inicial, você pode escolher rapidamente entre registrar um chamado ou ver o histórico.' },
    { title: 'Passo 3: Registro', description: 'Use o formulário detalhado para escolher a categoria correta e descrever seu problema.' },
    { title: 'Passo 4: Acompanhamento', description: 'O status do seu chamado é atualizado em tempo real: Recebido → Em andamento → Resolvido.' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else navigate('/login');
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="tutorial-page">
      <div className="tutorial-card">
        <h1>Bem-vindo ao ProfSOS!</h1>

        {/* Indicador textual de progresso */}
        <div className="step-info">
          Etapa {currentStep + 1} de {steps.length}
        </div>

        {/* Badges de progresso */}
        <div className="steps-badges">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`badge ${index <= currentStep ? 'active' : ''}`}
            >
              {/* O texto foi removido para usar apenas a bolinha, mantendo o visual clean */}
            </span>
          ))}
        </div>

        {/* Barra de progresso visual */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Conteúdo animado do passo */}
        <TransitionGroup>
          <CSSTransition key={currentStep} timeout={300} classNames="fade">
            <div>
              <h2>{steps[currentStep].title}</h2>
              <p>{steps[currentStep].description}</p>
            </div>
          </CSSTransition>
        </TransitionGroup>

        {/* Botões de navegação com novas classes */}
        <div className="tutorial-buttons">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="btn-prev"
          >
            Anterior
          </button>
          <button onClick={handleNext} className="btn-next">
            {currentStep === steps.length - 1 ? 'Começar a usar →' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;