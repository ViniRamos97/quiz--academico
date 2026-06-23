import {
  buscarUsuarioPorEmail,
  criarUsuario,
  atualizarSenha
} from '../models/userModel.js';

export async function cadastrarUser(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Nome, email e senha são obrigatórios'
      });
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: 'Usuário já existe'
      });
    }

    await criarUsuario(nome, email, senha);

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso'
    });

  } catch (erro) {
    console.error("ERRO COMPLETO:");
  console.error(erro);

  res.status(500).json({
    mensagem: erro.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({
        mensagem: 'Email ou senha inválidos'
      });
    }

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        pontos: usuario.pontos || 0
      }
    });

  } catch (erro) {
    console.error('ERRO:', erro);

    res.status(500).json({
      mensagem: 'Erro ao realizar login'
    });
  }
}

export async function redefinirSenha(req, res) {
  try {
    const { email, novaSenha } = req.body;

    if (!email || !novaSenha) {
      return res.status(400).json({
        mensagem: 'Email e nova senha são obrigatórios'
      });
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado'
      });
    }

    await atualizarSenha(email, novaSenha);

    res.status(200).json({
      mensagem: 'Senha atualizada com sucesso'
    });

  } catch (erro) {
    console.error('ERRO:', erro);

    res.status(500).json({
      mensagem: 'Erro ao redefinir senha'
    });
  }
}