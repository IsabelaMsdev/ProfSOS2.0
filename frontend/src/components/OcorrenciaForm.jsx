import { useState } from 'react';
import { criarOcorrencia } from '../services/api';
import './OcorrenciaF.css';

export default function OcorrenciaForm({ onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await criarOcorrencia({ titulo, descricao, setor });
      setMensagem('Ocorrência registrada com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
      setTitulo('');
      setDescricao('');
      setSetor('');
      onSuccess();
    } catch (err) {
      setMensagem('Erro ao registrar ocorrência');
      console.error(err);
      setTimeout(() => setMensagem(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Ocorrência</h2>
      {mensagem && <div className="alert">{mensagem}</div>}
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />
      <select value={setor} onChange={(e) => setSetor(e.target.value)} required>
        <option value="">Selecione o setor</option>
        <option value="TI">TI</option>
        <option value="Limpeza">Limpeza</option>
        <option value="Coordenação">Coordenação</option>
        <option value="Professores">Professores</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}
