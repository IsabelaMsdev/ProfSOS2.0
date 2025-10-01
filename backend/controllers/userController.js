const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt');

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const accessToken = jwtUtils.generateAccessToken(usuario);
    const refreshToken = jwtUtils.generateRefreshToken(usuario);

    // Salvar refresh token no banco
    usuario.refreshTokens.push(refreshToken);
    await usuario.save();

    const usuarioResposta = usuario.toObject();
    delete usuarioResposta.senha;

    res.json({
      message: 'Login bem-sucedido',
      accessToken,
      refreshToken,
      usuario: usuarioResposta
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: error.message });
  }
};

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token requerido' });
    }

    // Verificar se o refresh token é válido
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);
    
    // Buscar usuário e verificar se o refresh token existe
    const usuario = await User.findById(decoded.id);
    if (!usuario || !usuario.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ message: 'Usuário inativo' });
    }

    // Gerar novo access token
    const newAccessToken = jwtUtils.generateAccessToken(usuario);
    
    // Opcionalmente, gerar novo refresh token e remover o antigo
    const newRefreshToken = jwtUtils.generateRefreshToken(usuario);
    
    // Remover o refresh token antigo e adicionar o novo
    usuario.refreshTokens = usuario.refreshTokens.filter(token => token !== refreshToken);
    usuario.refreshTokens.push(newRefreshToken);
    await usuario.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Erro no refresh token:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Logout endpoint
exports.logoutUsuario = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.id; // Vem do middleware de autenticação

    if (refreshToken && userId) {
      // Remover o refresh token específico
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken }
      });
    }

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: error.message });
  }
};

// Logout de todos os dispositivos
exports.logoutTodosDispositivos = async (req, res) => {
  try {
    const userId = req.user.id;

    // Remover todos os refresh tokens
    await User.findByIdAndUpdate(userId, {
      refreshTokens: []
    });

    res.json({ message: 'Logout realizado em todos os dispositivos' });
  } catch (error) {
    console.error('Erro no logout global:', error);
    res.status(500).json({ message: error.message });
  }
};

// Registrar novo usuário
exports.registrarUsuario = async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      senha, 
      tipo, 
      instituicao, 
      departamento, 
      telefone,
      nivel_suporte,
      especialidades
    } = req.body;

    // Validação básica
    if (!nome || !email || !senha || !tipo || !instituicao) {
      return res.status(400).json({ 
        message: 'Nome, email, senha, tipo e instituição são obrigatórios' 
      });
    }

    // Validar tipo de usuário
    const tiposValidos = ['professor', 'academico', 'suporte'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ 
        message: 'Tipo de usuário inválido. Use: professor, academico ou suporte' 
      });
    }

    // Validação específica para usuários de suporte
    if (tipo === 'suporte' && !nivel_suporte) {
      return res.status(400).json({ 
        message: 'Nível de suporte é obrigatório para usuários de suporte' 
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criptografar senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Criar usuário
    const dadosUsuario = {
      nome,
      email,
      senha: senhaHash,
      tipo,
      instituicao,
      departamento,
      telefone
    };

    // Adicionar campos específicos para suporte
    if (tipo === 'suporte') {
      dadosUsuario.nivel_suporte = nivel_suporte;
      if (especialidades && Array.isArray(especialidades)) {
        dadosUsuario.especialidades = especialidades;
      }
    }

    const usuario = await User.create(dadosUsuario);

    // Remover senha da resposta
    const usuarioResposta = usuario.toObject();
    delete usuarioResposta.senha;

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      usuario: usuarioResposta
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Listar usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const { tipo, instituicao, ativo } = req.query;
    
    // Construir filtros
    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (instituicao) filtros.instituicao = instituicao;
    if (ativo !== undefined) filtros.ativo = ativo === 'true';

    const usuarios = await User.find(filtros).select('-senha');
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findById(id).select('-senha');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacoes = req.body;

    // Remover campos que não devem ser atualizados diretamente
    delete atualizacoes._id;
    delete atualizacoes.createdAt;
    delete atualizacoes.updatedAt;

    // Se a senha está sendo atualizada, criptografar
    if (atualizacoes.senha) {
      const saltRounds = 10;
      atualizacoes.senha = await bcrypt.hash(atualizacoes.senha, saltRounds);
    }

    const usuario = await User.findByIdAndUpdate(
      id,
      atualizacoes,
      { new: true, runValidators: true }
    ).select('-senha');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Desativar usuário (soft delete)
exports.desativarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByIdAndUpdate(
      id,
      { ativo: false },
      { new: true }
    ).select('-senha');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      message: 'Usuário desativado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reativar usuário
exports.reativarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByIdAndUpdate(
      id,
      { ativo: true },
      { new: true }
    ).select('-senha');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      message: 'Usuário reativado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao reativar usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Listar usuários de suporte por especialidade
exports.listarSuportePorEspecialidade = async (req, res) => {
  try {
    const { especialidade } = req.params;
    
    const usuariosSuporte = await User.find({
      tipo: 'suporte',
      ativo: true,
      especialidades: especialidade
    }).select('-senha');

    res.status(200).json(usuariosSuporte);
  } catch (error) {
    console.error('Erro ao listar suporte por especialidade:', error);
    res.status(500).json({ message: error.message });
  }
};
