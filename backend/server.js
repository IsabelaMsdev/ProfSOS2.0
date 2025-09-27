require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const ocorrenciaRoutes = require('./routes/ocorrenciaRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permitir requisições do frontend
app.use(express.json()); // Parse do body JSON

// Rotas
app.use('/api/ocorrencias', ocorrenciaRoutes);

// Conexão com MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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
