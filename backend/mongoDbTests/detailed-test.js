const mongoose = require('mongoose');

// URI diretamente no código
const MONGO_URI = 'mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster';

console.log('🔍 TESTE DETALHADO - INVESTIGANDO O QUE REALMENTE ACONTECE\n');

async function detailedTest() {
  let connection = null;
  
  try {
    console.log('1. 🔄 Iniciando conexão...');
    
    // Configuração com logs mais detalhados
    mongoose.set('debug', true); // Ativar logs do mongoose
    
    const startTime = Date.now();
    connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 segundos
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    const endTime = Date.now();
    
    console.log(`✅ CONEXÃO ESTABELECIDA em ${endTime - startTime}ms`);
    console.log(`   Host: ${connection.connection.host}`);
    console.log(`   Database: ${connection.connection.name}`);
    console.log(`   Estado: ${connection.connection.readyState}`);
    console.log(`   ID da conexão: ${connection.connection.id}`);
    
    // 2. Teste de ping
    console.log('\n2. 🏓 Testando ping...');
    const pingResult = await connection.connection.db.admin().ping();
    console.log('✅ Ping resultado:', pingResult);
    
    // 3. Teste de status do servidor
    console.log('\n3. 📊 Verificando status do servidor...');
    try {
      const serverStatus = await connection.connection.db.admin().serverStatus();
      console.log(`✅ MongoDB versão: ${serverStatus.version}`);
      console.log(`✅ Uptime: ${Math.floor(serverStatus.uptime / 3600)} horas`);
      console.log(`✅ Conexões ativas: ${serverStatus.connections?.current || 'N/A'}`);
    } catch (statusError) {
      console.log('⚠️ Não foi possível obter status do servidor:', statusError.message);
    }
    
    // 4. Listar databases
    console.log('\n4. 🗄️ Listando databases...');
    try {
      const adminDb = connection.connection.db.admin();
      const databases = await adminDb.listDatabases();
      console.log(`✅ Databases encontrados: ${databases.databases.length}`);
      databases.databases.forEach(db => {
        console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
      });
    } catch (dbError) {
      console.log('⚠️ Erro ao listar databases:', dbError.message);
    }
    
    // 5. Testar operações no database específico
    console.log('\n5. 🧪 Testando operações no database "sos-prof"...');
    const db = connection.connection.db;
    
    // Listar collections
    const collections = await db.listCollections().toArray();
    console.log(`✅ Collections no sos-prof: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // 6. Teste de escrita simples
    console.log('\n6. ✍️ Testando operação de escrita...');
    const testCollection = db.collection('connection_test');
    
    const testDoc = {
      timestamp: new Date(),
      test: 'connection_test',
      ip: 'test_from_node',
      success: true
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`✅ Documento inserido com ID: ${insertResult.insertedId}`);
    
    // 7. Teste de leitura
    console.log('\n7. 📖 Testando operação de leitura...');
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Documento encontrado:', foundDoc ? 'Sim' : 'Não');
    
    // 8. Limpeza
    console.log('\n8. 🧹 Limpando teste...');
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Documento de teste removido');
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('🔍 CONCLUSÃO: A conexão está funcionando perfeitamente!');
    console.log('❓ O erro anterior pode ser um falso positivo ou timeout.');
    
  } catch (error) {
    console.log('\n❌ ERRO DETALHADO:');
    console.log(`   Mensagem: ${error.message}`);
    console.log(`   Código: ${error.code || 'N/A'}`);
    console.log(`   Nome: ${error.name || 'N/A'}`);
    
    if (error.stack) {
      console.log('\n📋 Stack trace:');
      console.log(error.stack);
    }
    
    // Verificar se é realmente um erro de conexão
    if (connection && connection.connection.readyState === 1) {
      console.log('\n🤔 INTERESSANTE: Erro ocorreu mas conexão ainda está ativa!');
      console.log('   Isso sugere que o erro pode ser em uma operação específica, não na conexão.');
    }
    
  } finally {
    // Fechar conexão
    if (connection && connection.connection.readyState === 1) {
      console.log('\n🔌 Fechando conexão...');
      await mongoose.connection.close();
      console.log('✅ Conexão fechada');
    }
  }
}

console.log('🔗 URI sendo testada:');
console.log(MONGO_URI.replace(/:([^:@]+)@/, ':***@'));
console.log('');

detailedTest();
