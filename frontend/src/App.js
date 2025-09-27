import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registro from './pages/Registro';
import Painel from './pages/Painel';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Registro</Link> | <Link to="/painel">Painel</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Registro />} />
        <Route path="/painel" element={<Painel />} />
      </Routes>
    </Router>
  );
}

export default App;
