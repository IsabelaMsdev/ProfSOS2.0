const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/ocorrencias';

async function testeBackend() {
  try {
    console.log('--- Criando ocorrência ---');
    const criar = await axios.post(BASE_URL, {
      titulo: 'Teste Node',
      descricao: 'Teste direto no Node.js',
      setor: 'TI'
    });
    console.log('Ocorrência criada com sucesso:');
    console.log(criar.data);

    const ocorrenciaId = criar.data._id;

    console.log('\n--- Listando ocorrências ---');
    const listar = await axios.get(BASE_URL);
    console.log('Ocorrências encontradas:');
    console.log(listar.data);

    console.log('\n--- Atualizando ocorrência ---');
    const atualizar = await axios.put(`${BASE_URL}/${ocorrenciaId}`, {
      status: 'Em andamento'
    });
    console.log('Ocorrência atualizada:');
    console.log(atualizar.data);

  } catch (err) {
    if (err.response) {
      // Erro retornado pelo servidor
      console.log('Erro do servidor:', err.response.data);
    } else if (err.request) {
      // Nenhuma resposta recebida
      console.log('Erro de requisição:', err.request);
    } else {
      // Outro erro
      console.log('Erro:', err.message);
    }
  }
}

testeBackend();
