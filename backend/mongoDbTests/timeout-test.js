const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster';

console.log('⏱️ TESTE COM DIFERENTES TIMEOUTS\n');

const testConfigs = [
  {
    name: 'Timeout Muito Longo (2 minutos)',
    options: {
      serverSelectionTimeoutMS: 120000, // 2 minutos
      connectTimeoutMS: 120000,
      socketTimeoutMS: 120000,
    }
  },
  {
    name: 'Timeout Padrão MongoDB',
    options: {
      serverSelectionTimeoutMS: 30000, // 30 segundos (padrão)
    }
  },
  {
    name: 'Sem Timeout Customizado',
    options: {}
  }
];

async function testWithTimeout(config) {
  console.log(`\n🧪 Testando: ${config.name}`);
  console.log('   Configuração:', JSON.stringify(config.options, null, 2));
  
  const startTime = Date.now();
  
  try {
    console.log('   🔄 Conectando...');
    
    const conn = await mongoose.connect(MONGO_URI, config.options);
    const endTime = Date.now();
    
    console.log(`   ✅ SUCESSO em ${endTime - startTime}ms!`);
    console.log(`   📊 Host: ${conn.connection.host}`);
    console.log(`   📊 Database: ${conn.connection.name}`);
    
    // Teste rápido de operação
    await conn.connection.db.admin().ping();
    console.log('   ✅ Ping bem-sucedido');
    
    await mongoose.connection.close();
    console.log('   ✅ Conexão fechada');
    
    return true;
    
  } catch (error) {
    const endTime = Date.now();
    console.log(`   ❌ Falhou após ${endTime - startTime}ms`);
    console.log(`   📝 Erro: ${error.message}`);
    
    // Fechar qualquer conexão pendente
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    } catch (closeError) {
      // Ignorar erros de fechamento
    }
    
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes de timeout...\n');
  
  for (const config of testConfigs) {
    const success = await testWithTimeout(config);
    
    if (success) {
      console.log('\n🎉 ENCONTRAMOS UMA CONFIGURAÇÃO QUE FUNCIONA!');
      console.log(`   Use esta configuração: ${config.name}`);
      break;
    }
    
    // Aguardar um pouco entre testes
    console.log('   ⏳ Aguardando 5 segundos antes do próximo teste...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n📋 RESUMO:');
  console.log('   Se NENHUM teste funcionou, o problema é definitivamente no Atlas');
  console.log('   Se ALGUM teste funcionou, é questão de timeout/configuração');
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('   1. Pause e resume o cluster no Atlas');
  console.log('   2. Aguarde 10 minutos após resume');
  console.log('   3. Execute este teste novamente');
}

runAllTests();
