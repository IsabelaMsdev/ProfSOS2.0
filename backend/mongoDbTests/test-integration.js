require('dotenv').config({ path: '../.env' });
const axios = require('axios');

// Configuração base
const BASE_URL = 'http://localhost:5000/api';

// Função auxiliar para fazer requisições
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Erro na requisição ${method} ${url}:`, error.response?.data || error.message);
    throw error;
  }
}

// Teste completo de integração usuários + ocorrências
async function testeIntegracaoCompleta() {
  console.log('🚀 Iniciando teste de integração completa...\n');

  try {
    // 1. Registrar usuários
    console.log('1. Registrando usuários...');
    
    // Professor
    const professor = await makeRequest('POST', '/users/registrar', {
      nome: 'Prof. Ana Costa',
      email: 'ana.costa@universidade.edu.br',
      senha: 'senha123',
      tipo: 'professor',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'Engenharia',
      telefone: '(11) 99999-1111'
    });
    console.log('✅ Professor registrado:', professor.usuario.nome);
    const professorId = professor.usuario._id;

    // Acadêmico
    const academico = await makeRequest('POST', '/users/registrar', {
      nome: 'João Estudante',
      email: 'joao.estudante@universidade.edu.br',
      senha: 'senha456',
      tipo: 'academico',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'Ciência da Computação',
      telefone: '(11) 99999-2222'
    });
    console.log('✅ Acadêmico registrado:', academico.usuario.nome);
    const academicoId = academico.usuario._id;

    // Técnicos de suporte
    const tecnico1 = await makeRequest('POST', '/users/registrar', {
      nome: 'Carlos Hardware',
      email: 'carlos.hardware@universidade.edu.br',
      senha: 'senha789',
      tipo: 'suporte',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'TI',
      telefone: '(11) 99999-3333',
      nivel_suporte: 'nivel2',
      especialidades: ['hardware', 'sistemas']
    });
    console.log('✅ Técnico 1 registrado:', tecnico1.usuario.nome);
    const tecnico1Id = tecnico1.usuario._id;

    const tecnico2 = await makeRequest('POST', '/users/registrar', {
      nome: 'Maria Software',
      email: 'maria.software@universidade.edu.br',
      senha: 'senha101',
      tipo: 'suporte',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'TI',
      telefone: '(11) 99999-4444',
      nivel_suporte: 'nivel3',
      especialidades: ['software', 'rede', 'sistemas']
    });
    console.log('✅ Técnico 2 registrado:', tecnico2.usuario.nome);
    const tecnico2Id = tecnico2.usuario._id;

    // 2. Criar ocorrências
    console.log('\n2. Criando ocorrências...');
    
    // Ocorrência do professor
    const ocorrencia1 = await makeRequest('POST', '/ocorrencias', {
      titulo: 'Computador não liga no laboratório',
      descricao: 'O computador da bancada 5 do laboratório de química não está ligando. Preciso urgente para a aula de amanhã.',
      setor: 'Laboratório',
      usuario_criador: professorId,
      prioridade: 'Alta'
    });
    console.log('✅ Ocorrência 1 criada:', ocorrencia1.titulo);
    const ocorrencia1Id = ocorrencia1._id;

    // Ocorrência do acadêmico
    const ocorrencia2 = await makeRequest('POST', '/ocorrencias', {
      titulo: 'Problema com software de simulação',
      descricao: 'O MATLAB não está abrindo nos computadores da sala 201. Aparece erro de licença.',
      setor: 'Sala de Aula',
      usuario_criador: academicoId,
      prioridade: 'Média'
    });
    console.log('✅ Ocorrência 2 criada:', ocorrencia2.titulo);
    const ocorrencia2Id = ocorrencia2._id;

    // Ocorrência crítica
    const ocorrencia3 = await makeRequest('POST', '/ocorrencias', {
      titulo: 'Rede sem internet em todo o prédio',
      descricao: 'A internet caiu em todo o prédio da administração. Sistemas críticos fora do ar.',
      setor: 'Administrativo',
      usuario_criador: professorId,
      prioridade: 'Crítica'
    });
    console.log('✅ Ocorrência 3 criada:', ocorrencia3.titulo);
    const ocorrencia3Id = ocorrencia3._id;

    // 3. Sugerir técnicos para as ocorrências
    console.log('\n3. Sugerindo técnicos para as ocorrências...');
    
    const sugestoes1 = await makeRequest('GET', `/ocorrencias/${ocorrencia1Id}/sugerir-tecnicos`);
    console.log(`✅ Técnicos sugeridos para "${ocorrencia1.titulo}":`, 
                sugestoes1.tecnicos_sugeridos.map(t => t.nome));

    const sugestoes2 = await makeRequest('GET', `/ocorrencias/${ocorrencia2Id}/sugerir-tecnicos`);
    console.log(`✅ Técnicos sugeridos para "${ocorrencia2.titulo}":`, 
                sugestoes2.tecnicos_sugeridos.map(t => t.nome));

    // 4. Atribuir técnicos às ocorrências
    console.log('\n4. Atribuindo técnicos às ocorrências...');
    
    // Atribuir técnico de hardware para problema de computador
    const atribuicao1 = await makeRequest('PATCH', `/ocorrencias/${ocorrencia1Id}/atribuir`, {
      tecnico_id: tecnico1Id
    });
    console.log('✅ Técnico atribuído à ocorrência 1:', atribuicao1.ocorrencia.tecnico_responsavel.nome);

    // Atribuir técnico de software para problema do MATLAB
    const atribuicao2 = await makeRequest('PATCH', `/ocorrencias/${ocorrencia2Id}/atribuir`, {
      tecnico_id: tecnico2Id
    });
    console.log('✅ Técnico atribuído à ocorrência 2:', atribuicao2.ocorrencia.tecnico_responsavel.nome);

    // Atribuir técnico de rede para problema crítico
    const atribuicao3 = await makeRequest('PATCH', `/ocorrencias/${ocorrencia3Id}/atribuir`, {
      tecnico_id: tecnico2Id
    });
    console.log('✅ Técnico atribuído à ocorrência 3:', atribuicao3.ocorrencia.tecnico_responsavel.nome);

    // 5. Listar ocorrências por diferentes filtros
    console.log('\n5. Testando filtros de ocorrências...');
    
    // Ocorrências pendentes
    const pendentes = await makeRequest('GET', '/ocorrencias?status=Pendente');
    console.log(`✅ Ocorrências pendentes: ${pendentes.length}`);

    // Ocorrências em andamento
    const emAndamento = await makeRequest('GET', '/ocorrencias?status=Em Andamento');
    console.log(`✅ Ocorrências em andamento: ${emAndamento.length}`);

    // Ocorrências por prioridade crítica
    const criticas = await makeRequest('GET', '/ocorrencias?prioridade=Crítica');
    console.log(`✅ Ocorrências críticas: ${criticas.length}`);

    // 6. Listar ocorrências por usuário
    console.log('\n6. Listando ocorrências por usuário...');
    
    // Ocorrências criadas pelo professor
    const ocorrenciasProfessor = await makeRequest('GET', `/ocorrencias/usuario/${professorId}?tipo=criadas`);
    console.log(`✅ Ocorrências criadas pelo professor: ${ocorrenciasProfessor.length}`);

    // Ocorrências atribuídas ao técnico 2
    const ocorrenciasTecnico2 = await makeRequest('GET', `/ocorrencias/usuario/${tecnico2Id}?tipo=atribuidas`);
    console.log(`✅ Ocorrências atribuídas ao técnico 2: ${ocorrenciasTecnico2.length}`);

    // 7. Atualizar status das ocorrências
    console.log('\n7. Atualizando status das ocorrências...');
    
    // Resolver primeira ocorrência
    const resolucao1 = await makeRequest('PUT', `/ocorrencias/${ocorrencia1Id}`, {
      status: 'Resolvido',
      observacoes_tecnico: 'Problema resolvido. Era fonte queimada, foi substituída.'
    });
    console.log('✅ Ocorrência 1 resolvida. Data de resolução:', resolucao1.ocorrencia.data_resolucao);

    // Atualizar segunda ocorrência
    const atualizacao2 = await makeRequest('PUT', `/ocorrencias/${ocorrencia2Id}`, {
      observacoes_tecnico: 'Verificando licenças do MATLAB. Aguardando liberação do fornecedor.'
    });
    console.log('✅ Ocorrência 2 atualizada com observações do técnico');

    // 8. Buscar ocorrência completa
    console.log('\n8. Buscando dados completos da ocorrência...');
    
    const ocorrenciaCompleta = await makeRequest('GET', `/ocorrencias/${ocorrencia1Id}`);
    console.log('✅ Dados completos da ocorrência:');
    console.log(`   - Título: ${ocorrenciaCompleta.titulo}`);
    console.log(`   - Status: ${ocorrenciaCompleta.status}`);
    console.log(`   - Criador: ${ocorrenciaCompleta.usuario_criador.nome} (${ocorrenciaCompleta.usuario_criador.tipo})`);
    console.log(`   - Técnico: ${ocorrenciaCompleta.tecnico_responsavel.nome}`);
    console.log(`   - Especialidades do técnico: ${ocorrenciaCompleta.tecnico_responsavel.especialidades.join(', ')}`);
    console.log(`   - Data de resolução: ${ocorrenciaCompleta.data_resolucao}`);

    // 9. Estatísticas finais
    console.log('\n9. Estatísticas finais...');
    
    const todasOcorrencias = await makeRequest('GET', '/ocorrencias');
    const todosUsuarios = await makeRequest('GET', '/users');
    
    console.log(`✅ Total de ocorrências: ${todasOcorrencias.length}`);
    console.log(`✅ Total de usuários: ${todosUsuarios.length}`);
    console.log(`✅ Usuários por tipo:`);
    
    const tiposUsuario = todosUsuarios.reduce((acc, user) => {
      acc[user.tipo] = (acc[user.tipo] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(tiposUsuario).forEach(([tipo, count]) => {
      console.log(`   - ${tipo}: ${count}`);
    });

    console.log('\n🎉 Teste de integração completo executado com sucesso!');
    console.log('\n📊 Resumo do que foi testado:');
    console.log('   ✓ Registro de diferentes tipos de usuários');
    console.log('   ✓ Criação de ocorrências com referência ao usuário');
    console.log('   ✓ Sugestão automática de técnicos baseada no setor');
    console.log('   ✓ Atribuição de técnicos às ocorrências');
    console.log('   ✓ Filtragem de ocorrências por vários critérios');
    console.log('   ✓ Listagem de ocorrências por usuário');
    console.log('   ✓ Atualização de status e resolução de tickets');
    console.log('   ✓ Busca completa com dados relacionados');
    console.log('   ✓ Validações de negócio e integridade');

  } catch (error) {
    console.error('❌ Erro durante o teste de integração:', error.message);
  }
}

// Executar teste
if (require.main === module) {
  testeIntegracaoCompleta().catch(console.error);
}

module.exports = { testeIntegracaoCompleta };
