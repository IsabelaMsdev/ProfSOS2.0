require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dns = require('dns');
const { promisify } = require('util');

const dnsLookup = promisify(dns.lookup);
const dnsResolve = promisify(dns.resolve);

async function runDiagnostics() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE CONEXÃO MONGODB\n');
  console.log('=' * 60);
  
  // 1. Verificar variáveis de ambiente
  console.log('\n📋 1. VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE');
  console.log('-'.repeat(50));
  
  const mongoUri = process.env.MONGO_URI;
  console.log(`MONGO_URI definida: ${mongoUri ? '✅ Sim' : '❌ Não'}`);
  
  if (!mongoUri) {
    console.log('❌ MONGO_URI não encontrada. Verifique o arquivo .env');
    return;
  }
  
  // 2. Analisar a URI
  console.log('\n🔗 2. ANÁLISE DA URI DE CONEXÃO');
  console.log('-'.repeat(50));
  
  try {
    const url = new URL(mongoUri.replace('mongodb+srv://', 'https://'));
    console.log(`Protocolo: ${mongoUri.startsWith('mongodb+srv://') ? '✅ mongodb+srv' : '⚠️ ' + mongoUri.split('://')[0]}`);
    console.log(`Host: ${url.hostname}`);
    console.log(`Usuário: ${url.username || 'Não especificado'}`);
    console.log(`Senha: ${url.password ? '✅ Definida' : '❌ Não definida'}`);
    console.log(`Database: ${url.pathname.split('/')[1]?.split('?')[0] || 'Padrão'}`);
    
    // Verificar se a senha está mascarada
    if (url.password && (url.password.includes('<') || url.password.includes('>'))) {
      console.log('⚠️ ATENÇÃO: A senha parece estar mascarada (contém < ou >)');
      console.log('   Certifique-se de substituir <db_password> pela senha real');
    }
  } catch (error) {
    console.log(`❌ Erro ao analisar URI: ${error.message}`);
  }
  
  // 3. Verificar conectividade de rede
  console.log('\n🌐 3. TESTE DE CONECTIVIDADE DE REDE');
  console.log('-'.repeat(50));
  
  try {
    const hostname = mongoUri.match(/mongodb\+srv:\/\/[^:]+@([^/]+)/)?.[1];
    if (hostname) {
      console.log(`Testando DNS para: ${hostname}`);
      
      // Teste de DNS lookup
      try {
        const address = await dnsLookup(hostname);
        console.log(`✅ DNS Lookup: ${address.address} (${address.family === 4 ? 'IPv4' : 'IPv6'})`);
      } catch (dnsError) {
        console.log(`❌ DNS Lookup falhou: ${dnsError.message}`);
      }
      
      // Teste de resolução SRV (específico para mongodb+srv)
      try {
        const srvRecords = await dnsResolve(hostname, 'SRV');
        console.log(`✅ SRV Records encontrados: ${srvRecords.length}`);
        srvRecords.forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.name}:${record.port} (prioridade: ${record.priority})`);
        });
      } catch (srvError) {
        console.log(`❌ SRV Records não encontrados: ${srvError.message}`);
      }
    }
  } catch (error) {
    console.log(`❌ Erro no teste de rede: ${error.message}`);
  }
  
  // 4. Obter IP público atual
  console.log('\n🌍 4. VERIFICAÇÃO DE IP PÚBLICO');
  console.log('-'.repeat(50));
  
  try {
    const https = require('https');
    const getPublicIP = () => {
      return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
    };
    
    const publicIP = await getPublicIP();
    console.log(`IP Público atual: ${publicIP}`);
    console.log('📝 Verifique se este IP está na whitelist do MongoDB Atlas');
    console.log('   Ou adicione 0.0.0.0/0 para permitir qualquer IP (apenas desenvolvimento)');
  } catch (error) {
    console.log(`❌ Não foi possível obter IP público: ${error.message}`);
  }
  
  // 5. Teste de conexão detalhado
  console.log('\n🔌 5. TESTE DE CONEXÃO DETALHADO');
  console.log('-'.repeat(50));
  
  try {
    console.log('Tentando conectar com timeout de 10 segundos...');
    
    // Configuração mais detalhada
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 segundos
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    };
    
    const startTime = Date.now();
    const conn = await mongoose.connect(mongoUri, options);
    const endTime = Date.now();
    
    console.log(`✅ Conexão estabelecida em ${endTime - startTime}ms`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    
    // Teste de operação
    console.log('\n🧪 Testando operação básica...');
    const admin = conn.connection.db.admin();
    const serverStatus = await admin.serverStatus();
    console.log(`✅ Servidor MongoDB versão: ${serverStatus.version}`);
    console.log(`✅ Uptime: ${Math.floor(serverStatus.uptime / 3600)} horas`);
    
    await mongoose.connection.close();
    console.log('✅ Conexão fechada com sucesso');
    
  } catch (error) {
    console.log(`❌ Falha na conexão: ${error.message}`);
    
    // Análise específica do erro
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 DIAGNÓSTICO: Erro de autenticação');
      console.log('   - Verifique usuário e senha na URI');
      console.log('   - Confirme se o usuário existe no MongoDB Atlas');
      console.log('   - Verifique se o usuário tem permissões no database');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n💡 DIAGNÓSTICO: Problema de IP/Whitelist');
      console.log('   - Confirme se o IP atual está na whitelist');
      console.log('   - Tente adicionar 0.0.0.0/0 temporariamente');
      console.log('   - Verifique se não há firewall corporativo bloqueando');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('DNS')) {
      console.log('\n💡 DIAGNÓSTICO: Problema de DNS');
      console.log('   - Verifique sua conexão com a internet');
      console.log('   - Tente usar DNS público (8.8.8.8)');
      console.log('   - Confirme se o hostname está correto');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 DIAGNÓSTICO: Timeout de conexão');
      console.log('   - Conexão muito lenta ou bloqueada');
      console.log('   - Verifique firewall/proxy corporativo');
      console.log('   - Tente uma rede diferente');
    }
  }
  
  // 6. Verificações adicionais
  console.log('\n🔧 6. VERIFICAÇÕES ADICIONAIS');
  console.log('-'.repeat(50));
  
  // Verificar versões
  console.log(`Node.js: ${process.version}`);
  console.log(`Mongoose: ${mongoose.version}`);
  
  // Verificar arquivo .env
  const fs = require('fs');
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`Variáveis no .env: ${lines.length}`);
  } catch (error) {
    console.log('❌ Erro ao ler .env:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 DIAGNÓSTICO COMPLETO FINALIZADO');
  console.log('='.repeat(60));
}

// Executar diagnóstico
runDiagnostics().catch(console.error);
