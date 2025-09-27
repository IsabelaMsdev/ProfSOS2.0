import { useEffect, useState } from 'react';
import { listarOcorrencias, atualizarOcorrencia, deletarOcorrencia } from '../services/api';
import './OcorrenciaL.css';

export default function OcorrenciaList() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarOcorrencias = async () => {
    setLoading(true);
    try {
      const data = await listarOcorrencias();
      setOcorrencias(data);
    } catch (err) {
      alert('Erro ao carregar ocorrências');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  const handleAtualizar = async (id) => {
    try {
      await atualizarOcorrencia(id, 'Em andamento');
      carregarOcorrencias();
    } catch (err) {
      alert('Erro ao atualizar ocorrência');
      console.error(err);
    }
  };

  const handleDeletar = async (id) => {
    try {
      await deletarOcorrencia(id);
      carregarOcorrencias();
    } catch (err) {
      alert('Erro ao deletar ocorrência');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Painel de Ocorrências</h2>
      {loading && <div className="loader">Carregando ocorrências...</div>}
      {ocorrencias.length === 0 && !loading && <p>Nenhuma ocorrência registrada</p>}
      <ul>
        {ocorrencias.map((oc) => (
          <li key={oc._id}>
            <strong>{oc.titulo}</strong> - {oc.descricao} - <em>{oc.setor}</em> - 
            <span className={`status-${oc.status.toLowerCase().replace(' ', '-')}`}> {oc.status}</span>
            <button onClick={() => handleAtualizar(oc._id)}>Em andamento</button>
            <button onClick={() => handleDeletar(oc._id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
