const express = require('express');
const router = express.Router();
const controller = require('../controllers/ocorrenciaController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Todas as rotas de ocorrências requerem autenticação
router.use(authenticateToken);

// Rotas CRUD básicas
router.post('/', controller.criarOcorrencia);                    // Criar ocorrência (qualquer usuário autenticado)
router.get('/', controller.listarOcorrencias);                  // Listar ocorrências (qualquer usuário autenticado)
router.get('/:id', controller.buscarOcorrenciaPorId);           // Buscar ocorrência por ID (qualquer usuário autenticado)
router.put('/:id', controller.atualizarOcorrencia);             // Atualizar ocorrência (qualquer usuário autenticado)
router.delete('/:id', requireRole('suporte'), controller.deletarOcorrencia);            // Deletar ocorrência (apenas suporte)

// Rotas específicas para gerenciamento de tickets
router.patch('/:id/atribuir', requireRole('suporte'), controller.atribuirTecnico);      // Atribuir técnico (apenas suporte)
router.get('/:id/sugerir-tecnicos', requireRole('suporte'), controller.sugerirTecnicos); // Sugerir técnicos (apenas suporte)
router.get('/usuario/:userId', controller.listarOcorrenciasPorUsuario); // Listar ocorrências por usuário (qualquer usuário autenticado)

module.exports = router;
