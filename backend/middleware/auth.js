const jwtUtils = require('../utils/jwt');
const User = require('../models/User');

// Middleware para verificar autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token de acesso requerido' });
    }

    const decoded = jwtUtils.verifyAccessToken(token);
    
    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const usuario = await User.findById(decoded.id).select('-senha -refreshTokens');
    
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Anexar informações do usuário à requisição
    req.user = {
      id: usuario._id,
      email: usuario.email,
      tipo: usuario.tipo,
      nome: usuario.nome,
      instituicao: usuario.instituicao,
      nivel_suporte: usuario.nivel_suporte,
      especialidades: usuario.especialidades
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado' });
    }
    
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!allowedRoles.includes(req.user.tipo)) {
      return res.status(403).json({ 
        message: `Acesso negado. Requer um dos seguintes tipos: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware para verificar se é suporte de nível específico
const requireSupportLevel = (...allowedLevels) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (req.user.tipo !== 'suporte') {
      return res.status(403).json({ message: 'Acesso restrito a usuários de suporte' });
    }

    if (!allowedLevels.includes(req.user.nivel_suporte)) {
      return res.status(403).json({ 
        message: `Nível de suporte insuficiente. Requer: ${allowedLevels.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware para verificar se o usuário pode acessar seus próprios dados ou é admin
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  const targetUserId = req.params.id || req.params.userId;
  const isOwner = req.user.id.toString() === targetUserId;
  const isAdmin = req.user.tipo === 'suporte' && req.user.nivel_suporte === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Acesso negado. Você só pode acessar seus próprios dados' });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireSupportLevel,
  requireOwnershipOrAdmin
};
