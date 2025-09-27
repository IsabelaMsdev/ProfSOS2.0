const Ocorrencia = require('../models/Ocorrencia');

// Criar ocorrência
exports.criarOcorrencia = async (req, res) => {
  try {
    const { titulo, descricao, setor } = req.body;

    // Validação básica
    if (!titulo || !descricao || !setor) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const ocorrencia = await Ocorrencia.create({ titulo, descricao, setor });
    res.status(201).json(ocorrencia);
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({ message: error.message });
  }
};

// Listar ocorrências
exports.listarOcorrencias = async (req, res) => {
  try {
    const ocorrencias = await Ocorrencia.find();
    res.status(200).json(ocorrencias);
  } catch (error) {
    console.error('Erro ao listar ocorrências:', error);
    res.status(500).json({ message: error.message });
  }
};

// Atualizar status da ocorrência
exports.atualizarOcorrencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'O status é obrigatório' });
    }

    const ocorrencia = await Ocorrencia.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ocorrencia) {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }

    res.status(200).json(ocorrencia);
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
