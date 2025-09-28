// Teste mais simples possível - sem dotenv, sem complicações
const mongoose = require('mongoose');

// URI diretamente no código para teste
const MONGO_URI = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster';

console.log('🧪 TESTE SIMPLES E DIRETO\n');

async function simpleTest() {
  try {
    console.log('1. Testando conexão direta (sem .env)...');
    
    // Conexão mais simples possível
    const conn = await mongoose.connect(MONGO_URI);
    
    console.log('✅ SUCESSO! Conexão estabelecida');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Estado: ${conn.connection.readyState}`);
    
    // Teste básico
    console.log('\n2. Testando operação básica...');
    await conn.connection.db.admin().ping();
    console.log('✅ Ping bem-sucedido');
    
    // Listar collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`✅ Collections: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('   O problema NÃO é com a conexão MongoDB');
    console.log('   O problema pode ser com o carregamento do .env');
    
  } catch (error) {
    console.log('❌ ERRO:', error.message);
    
    // Análise do erro
    if (error.message.includes('authentication')) {
      console.log('\n🔍 DIAGNÓSTICO: Problema de autenticação');
      console.log('   - Usuário ou senha incorretos');
      console.log('   - Verifique no Atlas: Database Access');
    } else if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.log('\n🔍 DIAGNÓSTICO: Problema de IP (mesmo com 0.0.0.0/0)');
      console.log('   - Aguarde 2-3 minutos após adicionar 0.0.0.0/0');
      console.log('   - Verifique se o cluster não está pausado');
      console.log('   - Tente pausar e resumir o cluster');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔍 DIAGNÓSTICO: Problema de DNS/Rede');
      console.log('   - Problema de conectividade');
      console.log('   - Tente uma rede diferente');
    } else {
      console.log('\n🔍 DIAGNÓSTICO: Erro desconhecido');
      console.log('   - Erro específico:', error.code);
    }
  }
}

console.log('URI sendo testada:');
console.log(MONGO_URI.replace(/:([^:@]+)@/, ':***@'));
console.log('');

simpleTest();
