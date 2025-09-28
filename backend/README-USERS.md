# Sistema de Usuários - SoS-prof

Este documento descreve o sistema de gerenciamento de usuários implementado no backend do SoS-prof, que permite o registro e gerenciamento de professores, acadêmicos e equipe de suporte técnico.

## Estrutura do Sistema

### Tipos de Usuário

O sistema suporta três tipos de usuários:

1. **Professor** (`professor`) - Docentes da instituição
2. **Acadêmico** (`academico`) - Estudantes, pesquisadores e outros acadêmicos
3. **Suporte** (`suporte`) - Equipe de suporte técnico

### Modelo de Dados (User Schema)

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
  especialidades: Array - ['hardware', 'software', 'rede', 'sistemas', 'audiovisual', 'outros']
}
```

## API Endpoints

### Base URL: `/api/users`

### 1. Registrar Usuário
- **POST** `/api/users/registrar`
- **Descrição**: Registra um novo usuário no sistema
- **Body**:
```json
{
  "nome": "Dr. João Silva",
  "email": "joao.silva@universidade.edu.br",
  "senha": "senha123",
  "tipo": "professor",
  "instituicao": "Universidade Federal do ABC",
  "departamento": "Ciência da Computação",
  "telefone": "(11) 99999-9999"
}
```

### 2. Registrar Usuário de Suporte
- **POST** `/api/users/registrar`
- **Body**:
```json
{
  "nome": "Carlos Técnico",
  "email": "carlos.tecnico@universidade.edu.br",
  "senha": "senha789",
  "tipo": "suporte",
  "instituicao": "Universidade Federal do ABC",
  "departamento": "TI",
  "telefone": "(11) 77777-7777",
  "nivel_suporte": "nivel2",
  "especialidades": ["hardware", "software", "rede"]
}
```

### 3. Listar Usuários
- **GET** `/api/users`
- **Query Parameters** (opcionais):
  - `tipo`: Filtrar por tipo de usuário
  - `instituicao`: Filtrar por instituição
  - `ativo`: Filtrar por status ativo (true/false)
- **Exemplo**: `/api/users?tipo=suporte&ativo=true`

### 4. Buscar Usuário por ID
- **GET** `/api/users/:id`
- **Descrição**: Retorna dados de um usuário específico

### 5. Atualizar Usuário
- **PUT** `/api/users/:id`
- **Descrição**: Atualiza dados de um usuário
- **Body**: Campos a serem atualizados

### 6. Desativar Usuário
- **PATCH** `/api/users/:id/desativar`
- **Descrição**: Desativa um usuário (soft delete)

### 7. Reativar Usuário
- **PATCH** `/api/users/:id/reativar`
- **Descrição**: Reativa um usuário desativado

### 8. Listar Suporte por Especialidade
- **GET** `/api/users/suporte/especialidade/:especialidade`
- **Descrição**: Lista usuários de suporte com uma especialidade específica
- **Exemplo**: `/api/users/suporte/especialidade/hardware`

## Validações

### Campos Obrigatórios
- `nome`, `email`, `senha`, `tipo`, `instituicao`

### Validações Específicas
- **Email único**: Não permite emails duplicados
- **Tipo válido**: Apenas 'professor', 'academico' ou 'suporte'
- **Nível de suporte**: Obrigatório para usuários tipo 'suporte'
- **Especialidades**: Array válido para usuários de suporte

### Segurança
- Senhas são criptografadas usando bcrypt
- Senhas nunca são retornadas nas respostas da API
- Validação de dados de entrada em todas as rotas

## Níveis de Suporte

- **nivel1**: Suporte básico (primeiro atendimento)
- **nivel2**: Suporte intermediário
- **nivel3**: Suporte avançado (especialistas)
- **admin**: Administradores do sistema

## Especialidades de Suporte

- **hardware**: Problemas de equipamentos físicos
- **software**: Problemas de software e aplicativos
- **rede**: Problemas de conectividade e rede
- **sistemas**: Problemas de sistemas operacionais
- **audiovisual**: Equipamentos de áudio e vídeo
- **outros**: Outras especialidades

## Exemplos de Uso

### Registrar um Professor
```bash
curl -X POST http://localhost:5000/api/users/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Maria Silva",
    "email": "maria.silva@universidade.edu.br",
    "senha": "senha123",
    "tipo": "professor",
    "instituicao": "Universidade Federal do ABC",
    "departamento": "Matemática"
  }'
```

### Listar Usuários de Suporte Ativos
```bash
curl "http://localhost:5000/api/users?tipo=suporte&ativo=true"
```

### Buscar Técnicos de Hardware
```bash
curl "http://localhost:5000/api/users/suporte/especialidade/hardware"
```

## Testes

Execute o arquivo de testes para verificar todas as funcionalidades:

```bash
node test-users.js
```

O arquivo de teste inclui:
- Registro de diferentes tipos de usuários
- Listagem e filtragem
- Atualizações de dados
- Ativação/desativação
- Testes de validação
- Busca por especialidades

## Integração com Sistema de Ocorrências

O sistema de usuários foi projetado para integrar perfeitamente com o sistema de ocorrências existente, permitindo:

- Identificação do usuário que cria uma ocorrência
- Atribuição de ocorrências para técnicos específicos
- Filtragem de técnicos por especialidade
- Controle de acesso baseado no tipo de usuário

## Dependências Adicionais

- **bcrypt**: Para criptografia de senhas
- **mongoose**: Para modelagem de dados (já existente)

## Próximos Passos Sugeridos

1. **Autenticação**: Implementar JWT para login/logout
2. **Autorização**: Controle de acesso baseado em roles
3. **Integração**: Conectar usuários com ocorrências
4. **Notificações**: Sistema de notificações por email
5. **Dashboard**: Interface administrativa para gerenciar usuários
