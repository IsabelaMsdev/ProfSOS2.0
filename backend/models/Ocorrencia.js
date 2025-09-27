const mongoose = require('mongoose');

const OcorrenciaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    setor: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pendente', 'Em Andamento', 'Resolvido', 'Cancelado'],
      default: 'Pendente' 
    },
    prioridade: {
      type: String,
      enum: ['Baixa', 'Média', 'Alta', 'Crítica'],
      default: 'Média'
    },
    // Referência ao usuário que criou a ocorrência
    usuario_criador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Referência ao técnico responsável (opcional)
    tecnico_responsavel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Data de resolução
    data_resolucao: {
      type: Date
    },
    // Comentários/observações do técnico
    observacoes_tecnico: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema);
