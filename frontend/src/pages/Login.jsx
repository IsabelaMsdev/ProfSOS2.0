import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // Novo estado para o erro
  const [erro, setErro] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();
    // setErro(""); // Limpa erro anterior

    // Lógica de autenticação (MOCK: substitua por chamada à API)
    // if (email === "user@profsos.com" && senha === "123456") {
    //   console.log("Login feito:", { email, senha });
    //   navigate("/home"); // Sucesso
    // } else {
    //   // Exibe a mensagem de erro
    //   setErro("Credenciais inválidas. Tente novamente ou revise o tutorial.");
    // }
    if (!email && !senha) {
      setErro("Por favor, insira e-mail e senha.");
    }

    const user = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Accept": "/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })
    console.log(user)
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <h1>ProfSOS Login</h1>
        
        {/* Componente de alerta de erro */}
        <div className={`error-alert ${erro ? 'show' : ''}`} role="alert">
            {erro}
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" onClick={handleLogin}>Entrar</button>
        </form>
        <button onClick={() => navigate("/")} className="btn-secondary">Voltar para Tutorial</button>
      </div>
    </div>
  );
}

export default Login;