require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const ocorrenciaRoutes = require('./routes/ocorrenciaRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Verificar variáveis de ambiente obrigatórias
if (!process.env.MONGO_URI) {
  console.error('❌ ERRO: MONGO_URI não está definida no arquivo .env');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ ERRO: JWT_SECRET não está definida no arquivo .env');
  process.exit(1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error('❌ ERRO: JWT_REFRESH_SECRET não está definida no arquivo .env');
  process.exit(1);
}

// Middlewares
app.use(cors()); // Permitir requisições do frontend
app.use(express.json({ limit: '10mb' })); // Parse do body JSON com limite
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse de form data

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);

// Conexão com MongoDB
const mongoURI = process.env.MONGO_URI;

console.log('🔄 Conectando ao MongoDB...');
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 10000, // 10 segundos para seleção do servidor
  connectTimeoutMS: 10000, // 10 segundos para conexão
  socketTimeoutMS: 45000, // 45 segundos para operações
})
.then(() => {
  console.log('✅ MongoDB conectado com sucesso!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  process.exit(1);
});

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
