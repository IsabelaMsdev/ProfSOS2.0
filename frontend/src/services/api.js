import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ocorrencias';

export const criarOcorrencia = async (dados) => {
  const response = await axios.post(API_URL, dados);
  return response.data;
};

export const listarOcorrencias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const atualizarOcorrencia = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}`, { status });
  return response.data;
};

export const deletarOcorrencia = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
