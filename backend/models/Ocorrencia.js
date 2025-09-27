const mongoose = require('mongoose');

const OcorrenciaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    setor: { type: String, required: true },
    status: { type: String, default: 'Pendente' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema);
