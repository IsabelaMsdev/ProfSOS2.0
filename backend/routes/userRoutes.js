const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

// Rotas públicas (não requerem autenticação)
router.post('/registrar', controller.registrarUsuario);           // Registrar novo usuário
router.post('/login', controller.loginUsuario);                   // Login
router.post('/refresh-token', controller.refreshToken);           // Refresh token

// Rotas protegidas (requerem autenticação)
router.post('/logout', authenticateToken, controller.logoutUsuario);                    // Logout
router.post('/logout-all', authenticateToken, controller.logoutTodosDispositivos);     // Logout de todos os dispositivos

// Rotas específicas para suporte (DEVEM vir ANTES das rotas com :id)
router.get('/suporte/especialidade/:especialidade', authenticateToken, controller.listarSuportePorEspecialidade); // Listar suporte por especialidade

// Rotas de usuário protegidas
router.get('/', authenticateToken, requireRole('suporte'), controller.listarUsuarios);                      // Listar usuários (apenas suporte)
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, controller.buscarUsuarioPorId);               // Buscar usuário por ID (próprio ou admin)
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, controller.atualizarUsuario);                 // Atualizar usuário (próprio ou admin)
router.patch('/:id/desativar', authenticateToken, requireRole('suporte'), controller.desativarUsuario);     // Desativar usuário (apenas suporte)
router.patch('/:id/reativar', authenticateToken, requireRole('suporte'), controller.reativarUsuario);       // Reativar usuário (apenas suporte)

module.exports = router;
