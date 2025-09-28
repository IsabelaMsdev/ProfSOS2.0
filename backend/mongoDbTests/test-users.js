const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
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

// Testes das funcionalidades de usuário
async function testarFuncionalidadesUsuario() {
  console.log('🚀 Iniciando testes das funcionalidades de usuário...\n');

  try {
    // 1. Registrar usuário professor
    console.log('1. Registrando usuário professor...');
    const professor = await makeRequest('POST', '/users/registrar', {
      nome: 'Dr. João Silva',
      email: 'joao.silva@universidade.edu.br',
      senha: 'senha123',
      tipo: 'professor',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'Ciência da Computação',
      telefone: '(11) 99999-9999'
    });
    console.log('✅ Professor registrado:', professor.usuario.nome);
    const professorId = professor.usuario._id;

    // 2. Registrar usuário acadêmico
    console.log('\n2. Registrando usuário acadêmico...');
    const academico = await makeRequest('POST', '/users/registrar', {
      nome: 'Maria Santos',
      email: 'maria.santos@universidade.edu.br',
      senha: 'senha456',
      tipo: 'academico',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'Engenharia',
      telefone: '(11) 88888-8888'
    });
    console.log('✅ Acadêmico registrado:', academico.usuario.nome);

    // 3. Registrar usuário de suporte
    console.log('\n3. Registrando usuário de suporte...');
    const suporte = await makeRequest('POST', '/users/registrar', {
      nome: 'Carlos Técnico',
      email: 'carlos.tecnico@universidade.edu.br',
      senha: 'senha789',
      tipo: 'suporte',
      instituicao: 'Universidade Federal do ABC',
      departamento: 'TI',
      telefone: '(11) 77777-7777',
      nivel_suporte: 'nivel2',
      especialidades: ['hardware', 'software', 'rede']
    });
    console.log('✅ Usuário de suporte registrado:', suporte.usuario.nome);
    const suporteId = suporte.usuario._id;

    // 4. Listar todos os usuários
    console.log('\n4. Listando todos os usuários...');
    const todosUsuarios = await makeRequest('GET', '/users');
    console.log(`✅ Total de usuários: ${todosUsuarios.length}`);

    // 5. Filtrar usuários por tipo
    console.log('\n5. Filtrando usuários por tipo (suporte)...');
    const usuariosSuporte = await makeRequest('GET', '/users?tipo=suporte');
    console.log(`✅ Usuários de suporte: ${usuariosSuporte.length}`);

    // 6. Buscar usuário por ID
    console.log('\n6. Buscando usuário por ID...');
    const usuarioBuscado = await makeRequest('GET', `/users/${professorId}`);
    console.log('✅ Usuário encontrado:', usuarioBuscado.nome);

    // 7. Atualizar usuário
    console.log('\n7. Atualizando telefone do professor...');
    const usuarioAtualizado = await makeRequest('PUT', `/users/${professorId}`, {
      telefone: '(11) 99999-0000'
    });
    console.log('✅ Usuário atualizado. Novo telefone:', usuarioAtualizado.usuario.telefone);

    // 8. Listar suporte por especialidade
    console.log('\n8. Listando suporte por especialidade (hardware)...');
    const suporteHardware = await makeRequest('GET', '/users/suporte/especialidade/hardware');
    console.log(`✅ Técnicos de hardware: ${suporteHardware.length}`);

    // 9. Desativar usuário
    console.log('\n9. Desativando usuário de suporte...');
    const usuarioDesativado = await makeRequest('PATCH', `/users/${suporteId}/desativar`);
    console.log('✅ Usuário desativado:', usuarioDesativado.usuario.nome, '- Ativo:', usuarioDesativado.usuario.ativo);

    // 10. Reativar usuário
    console.log('\n10. Reativando usuário de suporte...');
    const usuarioReativado = await makeRequest('PATCH', `/users/${suporteId}/reativar`);
    console.log('✅ Usuário reativado:', usuarioReativado.usuario.nome, '- Ativo:', usuarioReativado.usuario.ativo);

    console.log('\n🎉 Todos os testes foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Testes de validação
async function testarValidacoes() {
  console.log('\n🔍 Testando validações...\n');

  try {
    // Teste 1: Registrar usuário sem campos obrigatórios
    console.log('1. Testando registro sem campos obrigatórios...');
    try {
      await makeRequest('POST', '/users/registrar', {
        nome: 'Teste',
        email: 'teste@email.com'
        // Faltando senha, tipo e instituição
      });
    } catch (error) {
      console.log('✅ Validação funcionou - campos obrigatórios');
    }

    // Teste 2: Registrar usuário com tipo inválido
    console.log('\n2. Testando registro com tipo inválido...');
    try {
      await makeRequest('POST', '/users/registrar', {
        nome: 'Teste',
        email: 'teste2@email.com',
        senha: 'senha123',
        tipo: 'tipo_invalido',
        instituicao: 'Teste'
      });
    } catch (error) {
      console.log('✅ Validação funcionou - tipo inválido');
    }

    // Teste 3: Registrar usuário de suporte sem nível
    console.log('\n3. Testando registro de suporte sem nível...');
    try {
      await makeRequest('POST', '/users/registrar', {
        nome: 'Suporte Teste',
        email: 'suporte.teste@email.com',
        senha: 'senha123',
        tipo: 'suporte',
        instituicao: 'Teste'
        // Faltando nivel_suporte
      });
    } catch (error) {
      console.log('✅ Validação funcionou - nível de suporte obrigatório');
    }

    console.log('\n✅ Testes de validação concluídos!');

  } catch (error) {
    console.error('❌ Erro durante testes de validação:', error.message);
  }
}

// Executar todos os testes
async function executarTodos() {
  console.log('='.repeat(60));
  console.log('🧪 TESTES DO SISTEMA DE USUÁRIOS - SoS-prof');
  console.log('='.repeat(60));
  
  await testarFuncionalidadesUsuario();
  await testarValidacoes();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TESTES FINALIZADOS');
  console.log('='.repeat(60));
}

// Verificar se o script está sendo executado diretamente
if (require.main === module) {
  executarTodos().catch(console.error);
}

module.exports = {
  testarFuncionalidadesUsuario,
  testarValidacoes,
  executarTodos
};
