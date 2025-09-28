require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🧪 Testando conexão com MongoDB...\n');
  
  try {
    // Verificar se as variáveis de ambiente estão carregadas
    console.log('📋 Verificando variáveis de ambiente:');
    console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Definida' : '❌ Não definida'}`);
    console.log(`   PORT: ${process.env.PORT || '5000 (padrão)'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development (padrão)'}\n`);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI não está definida no arquivo .env');
    }
    
    // Tentar conectar
    console.log('🔄 Conectando ao MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 segundos para seleção do servidor
      connectTimeoutMS: 10000, // 10 segundos para conexão
      socketTimeoutMS: 45000, // 45 segundos para operações
    });
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}\n`);
    
    // Testar operação básica
    console.log('🧪 Testando operação básica...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Collections existentes: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro no teste de conexão:');
    console.error(`   Mensagem: ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Dicas para resolver:');
      console.error('   - Verifique se o usuário e senha estão corretos');
      console.error('   - Certifique-se de que o usuário tem permissões no database');
    } else if (error.message.includes('network')) {
      console.error('\n💡 Dicas para resolver:');
      console.error('   - Verifique sua conexão com a internet');
      console.error('   - Confirme se o IP está na whitelist (MongoDB Atlas)');
    }
    
  } finally {
    // Fechar conexão
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Conexão fechada.');
    }
    process.exit(0);
  }
}

// Executar teste
testConnection();
