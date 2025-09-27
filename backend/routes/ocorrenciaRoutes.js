const express = require('express');
const router = express.Router();
const controller = require('../controllers/ocorrenciaController');

// Rotas CRUD
router.post('/', controller.criarOcorrencia);          // Criar
router.get('/', controller.listarOcorrencias);        // Listar
router.put('/:id', controller.atualizarOcorrencia);   // Atualizar status
router.delete('/:id', controller.deletarOcorrencia);  // Deletar

module.exports = router;
