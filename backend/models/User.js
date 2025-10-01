const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { 
      type: String, 
      required: true,
      enum: ['professor', 'academico', 'suporte'],
      default: 'professor'
    },
    instituicao: { type: String, required: true },
    departamento: { type: String },
    telefone: { type: String },
    ativo: { type: Boolean, default: true },
    // Campos específicos para acadêmicos
    curso: { type: String },
    matricula: { type: String },
    // Campos específicos para usuários de suporte
    nivel_suporte: {
      type: String,
      enum: ['nivel1', 'nivel2', 'nivel3', 'admin'],
      required: function() {
        return this.tipo === 'suporte';
      }
    },
    especialidades: [{
      type: String,
      enum: ['hardware', 'software', 'rede', 'sistemas', 'audiovisual', 'outros']
    }],
    // Refresh tokens para autenticação JWT
    refreshTokens: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Índices para otimização
UserSchema.index({ email: 1 });
UserSchema.index({ tipo: 1 });
UserSchema.index({ instituicao: 1 });

module.exports = mongoose.model('User', UserSchema);
