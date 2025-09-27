import OcorrenciaForm from '../components/OcorrenciaForm';
import OcorrenciaList from '../components/OcorrenciaList';
import { useState } from 'react';

export default function Registro() {
  const [atualizar, setAtualizar] = useState(false);

  return (
    <div>
      <OcorrenciaForm onSuccess={() => setAtualizar(!atualizar)} />
      <OcorrenciaList key={atualizar} />
    </div>
  );
}
