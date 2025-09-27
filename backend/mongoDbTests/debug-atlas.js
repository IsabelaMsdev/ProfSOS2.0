require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const https = require('https');

async function debugAtlasConnection() {
  console.log('🔍 DEBUG ESPECÍFICO PARA MONGODB ATLAS\n');
  
  const mongoUri = process.env.MONGO_URI;
  
  // 1. Verificar se a URI está correta
  console.log('1. 📋 ANÁLISE DETALHADA DA URI');
  console.log('-'.repeat(50));
  
  if (!mongoUri) {
    console.log('❌ MONGO_URI não definida');
    return;
  }
  
  // Mascarar senha para log seguro
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':***@');
  console.log(`URI (mascarada): ${maskedUri}`);
  
  // Extrair componentes
  const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
  if (!uriMatch) {
    console.log('❌ Formato de URI inválido');
    return;
  }
  
  const [, username, password, cluster, database] = uriMatch;
  console.log(`Usuário: ${username}`);
  console.log(`Senha: ${password ? '✅ Definida' : '❌ Vazia'}`);
  console.log(`Cluster: ${cluster}`);
  console.log(`Database: ${database}`);
  
  // 2. Verificar IP atual vs Atlas
  console.log('\n2. 🌍 VERIFICAÇÃO DE IP');
  console.log('-'.repeat(50));
  
  try {
    const getPublicIP = () => {
      return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data.trim()));
        }).on('error', reject);
      });
    };
    
    const currentIP = await getPublicIP();
    console.log(`IP atual: ${currentIP}`);
    console.log(`IP configurado no Atlas: 179.245.42.121/32`);
    
    if (currentIP === '179.245.42.121') {
      console.log('✅ IP atual corresponde ao configurado no Atlas');
    } else {
      console.log('⚠️ IP atual DIFERENTE do configurado no Atlas!');
      console.log('   Possíveis causas:');
      console.log('   - IP dinâmico mudou');
      console.log('   - Usando VPN');
      console.log('   - Proxy corporativo');
      console.log(`   Adicione o IP atual (${currentIP}) no Atlas`);
    }
  } catch (error) {
    console.log(`❌ Erro ao obter IP: ${error.message}`);
  }
  
  // 3. Teste de conectividade específico
  console.log('\n3. 🔌 TESTE DE CONECTIVIDADE ATLAS');
  console.log('-'.repeat(50));
  
  const testConfigs = [
    {
      name: 'Configuração Padrão',
      options: {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    },
    {
      name: 'Timeout Estendido',
      options: {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      }
    },
    {
      name: 'Configuração Mínima',
      options: {}
    }
  ];
  
  for (const config of testConfigs) {
    console.log(`\nTestando: ${config.name}`);
    try {
      console.log('  Conectando...');
      const startTime = Date.now();
      
      const conn = await mongoose.connect(mongoUri, config.options);
      const endTime = Date.now();
      
      console.log(`  ✅ Sucesso em ${endTime - startTime}ms`);
      console.log(`  Host: ${conn.connection.host}`);
      console.log(`  Database: ${conn.connection.name}`);
      
      // Teste rápido de operação
      await conn.connection.db.admin().ping();
      console.log('  ✅ Ping bem-sucedido');
      
      await mongoose.connection.close();
      console.log('  ✅ Conexão fechada');
      
      console.log('\n🎉 CONEXÃO FUNCIONANDO! Use esta configuração.');
      return;
      
    } catch (error) {
      console.log(`  ❌ Falhou: ${error.message}`);
      
      // Análise específica do erro
      if (error.code === 'ENOTFOUND') {
        console.log('    → Problema de DNS/conectividade');
      } else if (error.message.includes('authentication')) {
        console.log('    → Problema de autenticação (usuário/senha)');
      } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
        console.log('    → Problema de IP whitelist');
      } else if (error.message.includes('timeout')) {
        console.log('    → Timeout de conexão');
      }
    }
  }
  
  // 4. Verificações adicionais do Atlas
  console.log('\n4. 🔧 VERIFICAÇÕES ATLAS ESPECÍFICAS');
  console.log('-'.repeat(50));
  
  console.log('Verifique no MongoDB Atlas:');
  console.log('1. Database Access:');
  console.log('   - Usuário "admin" existe?');
  console.log('   - Senha está correta?');
  console.log('   - Usuário tem permissões de Read/Write?');
  console.log('   - Usuário pode acessar o database "sos-prof"?');
  console.log('');
  console.log('2. Network Access:');
  console.log('   - IP 179.245.42.121/32 está listado?');
  console.log('   - Entry está ativa (não expirada)?');
  console.log('   - Tente temporariamente 0.0.0.0/0');
  console.log('');
  console.log('3. Cluster Status:');
  console.log('   - Cluster está online?');
  console.log('   - Não está em manutenção?');
  console.log('   - Região está acessível?');
  
  // 5. Sugestões de resolução
  console.log('\n5. 🛠️ PRÓXIMOS PASSOS SUGERIDOS');
  console.log('-'.repeat(50));
  console.log('1. Tente adicionar 0.0.0.0/0 temporariamente no Atlas');
  console.log('2. Verifique se o cluster não está pausado');
  console.log('3. Teste com uma ferramenta externa (MongoDB Compass)');
  console.log('4. Verifique logs do Atlas (se disponível)');
  console.log('5. Tente de uma rede diferente');
}

debugAtlasConnection().catch(console.error);
