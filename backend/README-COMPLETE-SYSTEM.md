# Sistema SoS-prof - Documentação Completa

## Visão Geral

O SoS-prof é um sistema completo de gerenciamento de tickets de suporte técnico para instituições educacionais. O sistema permite que professores e acadêmicos submetam solicitações de suporte diretamente para a equipe técnica, com funcionalidades avançadas de atribuição, rastreamento e resolução.

## Arquitetura do Sistema

### Tecnologias Utilizadas
- **Backend**: Node.js + Express.js
- **Banco de Dados**: MongoDB + Mongoose
- **Autenticação**: bcrypt para hash de senhas
- **Validação**: Mongoose validators + validação customizada

### Estrutura de Diretórios
```
backend/
├── config/
│   └── db.js                 # Configuração do banco de dados
├── models/
│   ├── User.js              # Modelo de usuários
│   └── Ocorrencia.js        # Modelo de ocorrências/tickets
├── controllers/
│   ├── userController.js    # Lógica de usuários
│   └── ocorrenciaController.js # Lógica de ocorrências
├── routes/
│   ├── userRoutes.js        # Rotas de usuários
│   └── ocorrenciaRoutes.js  # Rotas de ocorrências
├── test-users.js            # Testes de usuários
├── test-integration.js      # Testes de integração
└── server.js               # Servidor principal
```

## Modelos de Dados

### Modelo User
```javascript
{
  nome: String (obrigatório),
  email: String (obrigatório, único),
  senha: String (obrigatório, criptografada),
  tipo: String (obrigatório) - ['professor', 'academico', 'suporte'],
  instituicao: String (obrigatório),
  departamento: String (opcional),
  telefone: String (opcional),
  ativo: Boolean (padrão: true),
  
  // Campos específicos para usuários de suporte
  nivel_suporte: String - ['nivel1', 'nivel2', 'nivel3', 'admin'],
  especialidades: Array - ['hardware', 'software', 'rede', 'sistemas', 'audiovisual', 'outros'],
  
  timestamps: true
}
```

### Modelo Ocorrencia (Ticket)
```javascript
{
  titulo: String (obrigatório),
  descricao: String (obrigatório),
  setor: String (obrigatório),
  status: String - ['Pendente', 'Em Andamento', 'Resolvido', 'Cancelado'],
  prioridade: String - ['Baixa', 'Média', 'Alta', 'Crítica'],
  usuario_criador: ObjectId (referência ao User, obrigatório),
  tecnico_responsavel: ObjectId (referência ao User, opcional),
  data_resolucao: Date (opcional),
  observacoes_tecnico: String (opcional),
  
  timestamps: true
}
```

## API Endpoints

### Usuários (`/api/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/registrar` | Registrar novo usuário |
| GET | `/` | Listar usuários (com filtros) |
| GET | `/:id` | Buscar usuário por ID |
| PUT | `/:id` | Atualizar usuário |
| PATCH | `/:id/desativar` | Desativar usuário |
| PATCH | `/:id/reativar` | Reativar usuário |
| GET | `/suporte/especialidade/:especialidade` | Listar suporte por especialidade |

### Ocorrências (`/api/ocorrencias`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Criar nova ocorrência |
| GET | `/` | Listar ocorrências (com filtros) |
| GET | `/:id` | Buscar ocorrência por ID |
| PUT | `/:id` | Atualizar ocorrência |
| DELETE | `/:id` | Deletar ocorrência |
| PATCH | `/:id/atribuir` | Atribuir técnico |
| GET | `/:id/sugerir-tecnicos` | Sugerir técnicos |
| GET | `/usuario/:userId` | Listar por usuário |

## Funcionalidades Principais

### 1. Gestão de Usuários
- **Registro de Usuários**: Suporte a 3 tipos (professor, acadêmico, suporte)
- **Validação de Dados**: Email único, tipos válidos, campos obrigatórios
- **Segurança**: Senhas criptografadas com bcrypt
- **Gestão de Estado**: Ativação/desativação de usuários
- **Especialidades**: Técnicos podem ter múltiplas especialidades

### 2. Sistema de Tickets
- **Criação de Tickets**: Usuários podem criar ocorrências
- **Priorização**: 4 níveis de prioridade
- **Rastreamento de Status**: Ciclo completo do ticket
- **Atribuição Inteligente**: Sugestão automática de técnicos
- **Histórico Completo**: Timestamps e observações

### 3. Atribuição de Técnicos
- **Sugestão Automática**: Baseada no setor e especialidades
- **Validação**: Apenas técnicos ativos podem ser atribuídos
- **Mapeamento Setor-Especialidade**:
  - TI → software, hardware, rede, sistemas
  - Laboratório → hardware, software, sistemas
  - Sala de Aula → audiovisual, hardware
  - Auditório → audiovisual, hardware
  - Biblioteca → software, hardware, rede
  - Administrativo → software, hardware, rede

### 4. Filtragem e Busca
- **Filtros de Usuários**: tipo, instituição, status ativo
- **Filtros de Ocorrências**: status, prioridade, setor, usuário, técnico
- **Busca por Usuário**: Tickets criados ou atribuídos
- **Ordenação**: Tickets mais recentes primeiro

## Exemplos de Uso

### Registrar Professor
```bash
curl -X POST http://localhost:5000/api/users/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. João Silva",
    "email": "joao.silva@universidade.edu.br",
    "senha": "senha123",
    "tipo": "professor",
    "instituicao": "Universidade Federal do ABC",
    "departamento": "Ciência da Computação"
  }'
```

### Registrar Técnico de Suporte
```bash
curl -X POST http://localhost:5000/api/users/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Técnico",
    "email": "carlos.tecnico@universidade.edu.br",
    "senha": "senha789",
    "tipo": "suporte",
    "instituicao": "Universidade Federal do ABC",
    "nivel_suporte": "nivel2",
    "especialidades": ["hardware", "software"]
  }'
```

### Criar Ticket
```bash
curl -X POST http://localhost:5000/api/ocorrencias \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Computador não liga",
    "descricao": "O computador da sala 101 não está ligando",
    "setor": "Laboratório",
    "usuario_criador": "USER_ID_HERE",
    "prioridade": "Alta"
  }'
```

### Atribuir Técnico
```bash
curl -X PATCH http://localhost:5000/api/ocorrencias/TICKET_ID/atribuir \
  -H "Content-Type: application/json" \
  -d '{
    "tecnico_id": "TECNICO_ID_HERE"
  }'
```

## Validações e Regras de Negócio

### Usuários
- Email deve ser único no sistema
- Usuários de suporte devem ter nível definido
- Apenas usuários ativos podem ser atribuídos a tickets
- Usuários de suporte não podem criar tickets

- Usuário criador é obrigatório e deve existir
- Apenas técnicos ativos podem ser atribuídos
- Status 'Resolvido' define automaticamente data de resolução
- Criador da ocorrência não pode ser alterado

## Testes

### Executar Testes de Usuários
```bash
node test-users.js
```

### Executar Teste de Integração Completa
```bash
node test-integration.js
```

### Cobertura dos Testes
- Registro de todos os tipos de usuários
- Validações de entrada
- Criação e gestão de tickets
- Atribuição de técnicos
- Filtragem e busca
- Fluxo completo de resolução
- Integração entre usuários e tickets
- ✅ Atribuição de técnicos
- ✅ Filtragem e busca
- ✅ Fluxo completo de resolução
- ✅ Integração entre usuários e tickets

## Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Criar arquivo `.env`:
```
MONGO_URI=mongodb://localhost:27017/sos-prof
PORT=5000
```

### 3. Iniciar Servidor
```bash
node server.js
```

## Próximos Passos Sugeridos

### Funcionalidades Avançadas
1. **Autenticação JWT**: Sistema de login/logout
2. **Autorização**: Controle de acesso baseado em roles
3. **Notificações**: Email/SMS para atualizações
4. **Dashboard**: Interface administrativa
5. **Relatórios**: Estatísticas e métricas
6. **API de Comentários**: Histórico de conversas
7. **Upload de Arquivos**: Anexos nos tickets
8. **SLA**: Controle de tempo de resolução

### Melhorias Técnicas
1. **Paginação**: Para listas grandes
2. **Cache**: Redis para performance
3. **Logs**: Sistema de auditoria
4. **Backup**: Estratégia de backup automático
5. **Monitoramento**: Health checks e métricas
6. **Documentação API**: Swagger/OpenAPI
7. **Testes Unitários**: Cobertura completa
8. **CI/CD**: Pipeline de deploy

## Considerações de Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de entrada em todas as rotas
- ✅ Sanitização de dados
- ✅ Controle de acesso por tipo de usuário
- ⚠️ **Implementar**: Autenticação JWT
- ⚠️ **Implementar**: Rate limiting
- ⚠️ **Implementar**: HTTPS obrigatório
- ⚠️ **Implementar**: Logs de auditoria

## Conclusão

O sistema SoS-prof foi desenvolvido seguindo as melhores práticas de desenvolvimento, com arquitetura limpa, código bem documentado e testes abrangentes. A implementação atual fornece uma base sólida para um sistema de tickets completo, com funcionalidades essenciais para gestão de suporte técnico em instituições educacionais.

O sistema está pronto para uso em ambiente de desenvolvimento e pode ser facilmente expandido com as funcionalidades sugeridas para atender necessidades mais específicas.
