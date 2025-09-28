const Ocorrencia = require('../models/Ocorrencia');
const User = require('../models/User');

// Criar ocorrência
exports.criarOcorrencia = async (req, res) => {
  try {
    const { titulo, descricao, setor, usuario_criador, prioridade } = req.body;

    // Validação básica
    if (!titulo || !descricao || !setor || !usuario_criador) {
      return res.status(400).json({ 
        message: 'Título, descrição, setor e usuário criador são obrigatórios' 
      });
    }

    // Verificar se o usuário existe
    const usuario = await User.findById(usuario_criador);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário pode criar ocorrências (não é suporte)
    if (usuario.tipo === 'suporte') {
      return res.status(403).json({ 
        message: 'Usuários de suporte não podem criar ocorrências' 
      });
    }

    const dadosOcorrencia = {
      titulo,
      descricao,
      setor,
      usuario_criador,
      prioridade: prioridade || 'Média'
    };

    const ocorrencia = await Ocorrencia.create(dadosOcorrencia);
    
    // Retornar com dados do usuário populados
    const ocorrenciaCompleta = await Ocorrencia.findById(ocorrencia._id)
      .populate('usuario_criador', 'nome email tipo instituicao')
      .populate('tecnico_responsavel', 'nome email especialidades');
    
    res.status(201).json(ocorrenciaCompleta);
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({ message: error.message });
  }
};

// Listar ocorrências
exports.listarOcorrencias = async (req, res) => {
  try {
    const { status, prioridade, setor, usuario_criador, tecnico_responsavel } = req.query;
    
    // Construir filtros
    const filtros = {};
    if (status) filtros.status = status;
    if (prioridade) filtros.prioridade = prioridade;
    if (setor) filtros.setor = setor;
    if (usuario_criador) filtros.usuario_criador = usuario_criador;
    if (tecnico_responsavel) filtros.tecnico_responsavel = tecnico_responsavel;

    const ocorrencias = await Ocorrencia.find(filtros)
      .populate('usuario_criador', 'nome email tipo instituicao departamento')
      .populate('tecnico_responsavel', 'nome email especialidades nivel_suporte')
      .sort({ createdAt: -1 }); // Mais recentes primeiro
    
    res.status(200).json(ocorrencias);
  } catch (error) {
    console.error('Erro ao listar ocorrências:', error);
    res.status(500).json({ message: error.message });
  }
};

// Atualizar ocorrência
exports.atualizarOcorrencia = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacoes = req.body;

    // Remover campos que não devem ser atualizados diretamente
    delete atualizacoes._id;
    delete atualizacoes.createdAt;
    delete atualizacoes.updatedAt;
    delete atualizacoes.usuario_criador; // Não permitir mudança do criador

    // Se o status está sendo alterado para 'Resolvido', definir data de resolução
    if (atualizacoes.status === 'Resolvido') {
      atualizacoes.data_resolucao = new Date();
    }

    const ocorrencia = await Ocorrencia.findByIdAndUpdate(
      id,
      atualizacoes,
      { new: true, runValidators: true }
    )
    .populate('usuario_criador', 'nome email tipo instituicao')
    .populate('tecnico_responsavel', 'nome email especialidades');

    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    res.status(200).json({
      message: 'Ocorrência atualizada com sucesso',
      ocorrencia
    });
  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    res.status(500).json({ message: error.message });
  }
};

// Deletar ocorrência
exports.deletarOcorrencia = async (req, res) => {
  try {
    const { id } = req.params;
    const ocorrencia = await Ocorrencia.findByIdAndDelete(id);

    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    res.status(200).json({ message: 'Ocorrência deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ocorrência:', error);
    res.status(500).json({ message: error.message });
  }
};

// Atribuir técnico a uma ocorrência
exports.atribuirTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { tecnico_id } = req.body;

    if (!tecnico_id) {
      return res.status(400).json({ message: 'ID do técnico é obrigatório' });
    }

    // Verificar se o técnico existe e é do tipo suporte
    const tecnico = await User.findById(tecnico_id);
    if (!tecnico) {
      return res.status(400).json({ message: 'Técnico não encontrado' });
    }

    if (tecnico.tipo !== 'suporte') {
      return res.status(400).json({ message: 'Usuário não é um técnico de suporte' });
    }

    if (!tecnico.ativo) {
      return res.status(400).json({ message: 'Técnico está inativo' });
    }

    // Atualizar a ocorrência
    const ocorrencia = await Ocorrencia.findByIdAndUpdate(
      id,
      { 
        tecnico_responsavel: tecnico_id,
        status: 'Em Andamento'
      },
      { new: true, runValidators: true }
    )
    .populate('usuario_criador', 'nome email tipo instituicao')
    .populate('tecnico_responsavel', 'nome email especialidades nivel_suporte');

    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    res.status(200).json({
      message: 'Técnico atribuído com sucesso',
      ocorrencia
    });
  } catch (error) {
    console.error('Erro ao atribuir técnico:', error);
    res.status(500).json({ message: error.message });
  }
};

// Buscar ocorrência por ID com dados completos
exports.buscarOcorrenciaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ocorrencia = await Ocorrencia.findById(id)
      .populate('usuario_criador', 'nome email tipo instituicao departamento telefone')
      .populate('tecnico_responsavel', 'nome email especialidades nivel_suporte telefone');

    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    res.status(200).json(ocorrencia);
  } catch (error) {
    console.error('Erro ao buscar ocorrência:', error);
    res.status(500).json({ message: error.message });
  }
};

// Listar ocorrências por usuário
exports.listarOcorrenciasPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tipo } = req.query; // 'criadas' ou 'atribuidas'

    let filtros = {};
    if (tipo === 'criadas') {
      filtros.usuario_criador = userId;
    } else if (tipo === 'atribuidas') {
      filtros.tecnico_responsavel = userId;
    } else {
      // Se não especificado, buscar ambos
      filtros = {
        $or: [
          { usuario_criador: userId },
          { tecnico_responsavel: userId }
        ]
      };
    }

    const ocorrencias = await Ocorrencia.find(filtros)
      .populate('usuario_criador', 'nome email tipo instituicao')
      .populate('tecnico_responsavel', 'nome email especialidades')
      .sort({ createdAt: -1 });

    res.status(200).json(ocorrencias);
  } catch (error) {
    console.error('Erro ao listar ocorrências por usuário:', error);
    res.status(500).json({ message: error.message });
  }
};

// Sugerir técnicos para uma ocorrência baseado no setor/especialidade
exports.sugerirTecnicos = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    // Mapear setores para especialidades
    const mapeamentoSetorEspecialidade = {
      'TI': ['software', 'hardware', 'rede', 'sistemas'],
      'Laboratório': ['hardware', 'software', 'sistemas'],
      'Sala de Aula': ['audiovisual', 'hardware'],
      'Auditório': ['audiovisual', 'hardware'],
      'Biblioteca': ['software', 'hardware', 'rede'],
      'Administrativo': ['software', 'hardware', 'rede']
    };

    const especialidadesSugeridas = mapeamentoSetorEspecialidade[ocorrencia.setor] || ['outros'];

    // Buscar técnicos ativos com as especialidades relevantes
    const tecnicosSugeridos = await User.find({
      tipo: 'suporte',
      ativo: true,
      especialidades: { $in: especialidadesSugeridas }
    }).select('nome email especialidades nivel_suporte');

    res.status(200).json({
      ocorrencia_id: id,
      setor: ocorrencia.setor,
      especialidades_sugeridas: especialidadesSugeridas,
      tecnicos_sugeridos: tecnicosSugeridos
    });
  } catch (error) {
    console.error('Erro ao sugerir técnicos:', error);
    res.status(500).json({ message: error.message });
  }
};
