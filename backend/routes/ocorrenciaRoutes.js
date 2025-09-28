const express = require('express');
const router = express.Router();
const controller = require('../controllers/ocorrenciaController');

// Rotas CRUD básicas
router.post('/', controller.criarOcorrencia);                    // Criar ocorrência
router.get('/', controller.listarOcorrencias);                  // Listar ocorrências (com filtros)
router.get('/:id', controller.buscarOcorrenciaPorId);           // Buscar ocorrência por ID
router.put('/:id', controller.atualizarOcorrencia);             // Atualizar ocorrência
router.delete('/:id', controller.deletarOcorrencia);            // Deletar ocorrência

// Rotas específicas para gerenciamento de tickets
router.patch('/:id/atribuir', controller.atribuirTecnico);      // Atribuir técnico a uma ocorrência
router.get('/:id/sugerir-tecnicos', controller.sugerirTecnicos); // Sugerir técnicos para ocorrência
router.get('/usuario/:userId', controller.listarOcorrenciasPorUsuario); // Listar ocorrências por usuário

module.exports = router;
