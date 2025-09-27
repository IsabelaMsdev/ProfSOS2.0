const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// Rotas de usuário
router.post('/registrar', controller.registrarUsuario);           // Registrar novo usuário
router.get('/', controller.listarUsuarios);                      // Listar usuários (com filtros opcionais)
router.get('/:id', controller.buscarUsuarioPorId);               // Buscar usuário por ID
router.put('/:id', controller.atualizarUsuario);                 // Atualizar usuário
router.patch('/:id/desativar', controller.desativarUsuario);     // Desativar usuário
router.patch('/:id/reativar', controller.reativarUsuario);       // Reativar usuário

// Rotas específicas para suporte
router.get('/suporte/especialidade/:especialidade', controller.listarSuportePorEspecialidade); // Listar suporte por especialidade

module.exports = router;
