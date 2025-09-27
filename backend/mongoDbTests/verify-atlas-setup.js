require('dotenv').config();

console.log('🔍 VERIFICAÇÃO PASSO-A-PASSO DO ATLAS SETUP\n');

console.log('Baseado no debug, seu IP está correto mas ainda há erro de whitelist.');
console.log('Isso indica um problema na configuração do Atlas.\n');

console.log('📋 CHECKLIST COMPLETO - Verifique cada item no MongoDB Atlas:\n');

console.log('1. 🌐 NETWORK ACCESS (Acesso de Rede)');
console.log('   □ Vá para "Network Access" no menu lateral');
console.log('   □ Verifique se 179.245.42.121/32 está listado');
console.log('   □ Confirme que o status está "ACTIVE" (não expirado)');
console.log('   □ Se houver data de expiração, verifique se não passou');
console.log('   □ TESTE: Adicione temporariamente 0.0.0.0/0 (Allow access from anywhere)');
console.log('   □ Clique em "Confirm" após adicionar\n');

console.log('2. 👤 DATABASE ACCESS (Acesso ao Banco)');
console.log('   □ Vá para "Database Access" no menu lateral');
console.log('   □ Confirme que o usuário "admin" existe');
console.log('   □ Verifique se o status está "Active"');
console.log('   □ Clique em "Edit" no usuário admin');
console.log('   □ Confirme que tem privilégios "Read and write to any database"');
console.log('   □ OU específico para "sos-prof" database');
console.log('   □ Se necessário, redefina a senha e atualize o .env\n');

console.log('3. 🏗️ CLUSTER STATUS (Status do Cluster)');
console.log('   □ Vá para "Clusters" (página principal)');
console.log('   □ Confirme que o cluster "MainCluster" está "Running"');
console.log('   □ Verifique se não há ícones de warning/error');
console.log('   □ Se estiver "Paused", clique em "Resume"');
console.log('   □ Aguarde alguns minutos se acabou de fazer mudanças\n');

console.log('4. 🔧 TESTE RÁPIDO NO ATLAS');
console.log('   □ No cluster, clique em "Connect"');
console.log('   □ Escolha "Connect your application"');
console.log('   □ Copie a connection string mostrada');
console.log('   □ Compare com a sua no .env (deve ser quase idêntica)\n');

console.log('5. 🚨 SOLUÇÕES EMERGENCIAIS');
console.log('   Se ainda não funcionar, tente na ordem:');
console.log('   □ Adicione 0.0.0.0/0 no Network Access');
console.log('   □ Crie um novo usuário de database com senha simples');
console.log('   □ Pause e resume o cluster');
console.log('   □ Tente de uma rede diferente (hotspot do celular)\n');

console.log('6. 🧪 APÓS FAZER MUDANÇAS NO ATLAS');
console.log('   □ Aguarde 2-3 minutos para propagação');
console.log('   □ Execute: node test-connection.js');
console.log('   □ Se funcionar, remova 0.0.0.0/0 e use apenas seu IP\n');

// Criar um teste simples para depois das mudanças
console.log('📝 COMANDO PARA TESTAR APÓS MUDANÇAS:');
console.log('   node test-connection.js\n');

console.log('🎯 FOCO PRINCIPAL:');
console.log('   O erro persiste mesmo com IP correto, então:');
console.log('   1. Adicione 0.0.0.0/0 temporariamente');
console.log('   2. Verifique se o usuário admin tem permissões corretas');
console.log('   3. Confirme que o cluster está ativo');
console.log('   4. Aguarde alguns minutos e teste novamente\n');

console.log('💡 DICA: Se 0.0.0.0/0 funcionar, o problema é especificamente');
console.log('   com a configuração do seu IP específico no Atlas.');

// Mostrar a URI atual (mascarada)
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':***@');
  console.log(`\n🔗 Sua URI atual: ${maskedUri}`);
}
