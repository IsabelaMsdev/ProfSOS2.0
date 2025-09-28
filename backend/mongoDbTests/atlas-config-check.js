console.log('🔍 VERIFICAÇÃO DE CONFIGURAÇÃO ATLAS\n');

// Vamos verificar se há algo específico na configuração
console.log('📋 CHECKLIST DE CONFIGURAÇÃO ATLAS:');
console.log('');

console.log('1. 🌐 NETWORK ACCESS - Verificar no Atlas:');
console.log('   □ Vá para "Network Access" no menu lateral');
console.log('   □ Deve ter pelo menos uma entrada: 0.0.0.0/0');
console.log('   □ Status deve ser "ACTIVE" (não "PENDING")');
console.log('   □ Se houver múltiplas entradas, delete todas e deixe só 0.0.0.0/0');
console.log('');

console.log('2. 👤 DATABASE ACCESS - Verificar usuário:');
console.log('   □ Vá para "Database Access"');
console.log('   □ Usuário "admin" deve existir');
console.log('   □ Status deve ser "Active"');
console.log('   □ Clique em "Edit" no usuário admin');
console.log('   □ Verifique a senha: deve ser "qRoLhi2oc7VBwhHO"');
console.log('   □ Privilégios: "Atlas admin" ou "Read and write to any database"');
console.log('');

console.log('3. 🔗 CONNECTION STRING - Verificar formato:');
console.log('   □ No cluster, clique "Connect"');
console.log('   □ Escolha "Connect your application"');
console.log('   □ Selecione "Node.js" e versão 4.1 ou later');
console.log('   □ Copie a connection string mostrada');
console.log('   □ Compare com a nossa:');
console.log('');
console.log('   Nossa atual:');
console.log('   mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster');
console.log('');
console.log('   A do Atlas deve ser similar (apenas o database pode ser diferente)');
console.log('');

console.log('4. 🏗️ CLUSTER STATUS:');
console.log('   □ Cluster deve mostrar status "Running" (verde)');
console.log('   □ Não deve ter ícones de warning ou error');
console.log('   □ Se mostrar "Paused", não há opção de pause/resume em clusters M0');
console.log('');

console.log('5. 🚨 POSSÍVEIS PROBLEMAS ESPECÍFICOS:');
console.log('');
console.log('   A. PROBLEMA DE SENHA:');
console.log('      - A senha pode ter caracteres especiais que precisam ser encoded');
console.log('      - Tente criar um novo usuário com senha simples (só letras/números)');
console.log('');
console.log('   B. PROBLEMA DE REGIÃO:');
console.log('      - Seu cluster está em AWS São Paulo (sa-east-1)');
console.log('      - Pode haver problema de conectividade regional');
console.log('');
console.log('   C. PROBLEMA DE FIREWALL CORPORATIVO:');
console.log('      - Sua rede pode estar bloqueando conexões MongoDB');
console.log('      - Tente de uma rede diferente (hotspot do celular)');
console.log('');

console.log('6. 🛠️ AÇÕES IMEDIATAS SUGERIDAS:');
console.log('');
console.log('   OPÇÃO 1 - Novo usuário:');
console.log('   □ Vá para Database Access');
console.log('   □ Clique "Add New Database User"');
console.log('   □ Username: testuser');
console.log('   □ Password: test123 (senha simples)');
console.log('   □ Privileges: "Read and write to any database"');
console.log('   □ Teste com essa nova credencial');
console.log('');
console.log('   OPÇÃO 2 - Teste de rede:');
console.log('   □ Use hotspot do celular');
console.log('   □ Execute o teste novamente');
console.log('   □ Se funcionar, é problema de firewall corporativo');
console.log('');
console.log('   OPÇÃO 3 - Connection string do Atlas:');
console.log('   □ Copie exatamente a connection string do Atlas');
console.log('   □ Substitua na nossa aplicação');
console.log('   □ Teste novamente');
console.log('');

console.log('💡 DICA IMPORTANTE:');
console.log('   Como você consegue acessar via web interface, o cluster está');
console.log('   funcionando. O problema é específico da conexão via aplicação.');
console.log('   Isso geralmente indica problema de credenciais ou firewall.');
console.log('');

console.log('🎯 PRÓXIMO PASSO:');
console.log('   1. Crie um novo usuário com senha simples');
console.log('   2. Teste de uma rede diferente');
console.log('   3. Se ainda falhar, há problema de firewall/proxy corporativo');
