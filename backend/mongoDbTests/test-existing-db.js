const mongoose = require('mongoose');

console.log('🎯 TESTE: CONECTAR AO DATABASE EXISTENTE\n');

// Teste 1: Conectar ao database sample_mflix que já existe
const MONGO_URI_EXISTING = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=MainCluster';

// Teste 2: Conectar sem especificar database (deixar MongoDB escolher)
const MONGO_URI_NO_DB = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster';

// Teste 3: Conectar ao sos-prof (nosso database desejado)
const MONGO_URI_SOS_PROF = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster';

async function testConnection(uri, description) {
  console.log(`\n🧪 ${description}`);
  console.log(`URI: ${uri.replace(/:([^:@]+)@/, ':***@')}`);
  
  try {
    const startTime = Date.now();
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    const endTime = Date.now();
    
    console.log(`✅ SUCESSO em ${endTime - startTime}ms`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Listar collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections: ${collections.length}`);
    collections.slice(0, 5).forEach(col => {
      console.log(`   - ${col.name}`);
    });
    if (collections.length > 5) {
      console.log(`   ... e mais ${collections.length - 5}`);
    }
    
    // Teste de ping
    await conn.connection.db.admin().ping();
    console.log('   ✅ Ping bem-sucedido');
    
    await mongoose.connection.close();
    return true;
    
  } catch (error) {
    console.log(`❌ FALHOU: ${error.message}`);
    
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    } catch (closeError) {
      // Ignorar
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testando diferentes configurações de database...\n');
  
  // Teste 1: Database existente
  const test1 = await testConnection(
    MONGO_URI_EXISTING, 
    'TESTE 1: Conectar ao database sample_mflix (existente)'
  );
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Teste 2: Sem database específico
  const test2 = await testConnection(
    MONGO_URI_NO_DB, 
    'TESTE 2: Conectar sem especificar database'
  );
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Teste 3: Nosso database desejado
  const test3 = await testConnection(
    MONGO_URI_SOS_PROF, 
    'TESTE 3: Conectar ao database sos-prof (novo)'
  );
  
  console.log('\n📊 RESULTADOS:');
  console.log(`   Database existente (sample_mflix): ${test1 ? '✅ Funcionou' : '❌ Falhou'}`);
  console.log(`   Sem database específico: ${test2 ? '✅ Funcionou' : '❌ Falhou'}`);
  console.log(`   Database sos-prof (novo): ${test3 ? '✅ Funcionou' : '❌ Falhou'}`);
  
  if (test1 && !test3) {
    console.log('\n💡 DIAGNÓSTICO:');
    console.log('   O problema é que o database "sos-prof" não existe ainda.');
    console.log('   MongoDB Atlas pode estar rejeitando conexões para databases inexistentes.');
    console.log('\n🛠️ SOLUÇÕES:');
    console.log('   1. Criar o database "sos-prof" manualmente no Atlas');
    console.log('   2. Ou usar um database existente temporariamente');
    console.log('   3. Ou conectar sem especificar database e criar depois');
  } else if (test3) {
    console.log('\n🎉 PERFEITO! O database sos-prof está funcionando!');
  } else if (!test1 && !test2 && !test3) {
    console.log('\n🚨 Ainda há um problema de conectividade geral.');
  }
}

runTests();
