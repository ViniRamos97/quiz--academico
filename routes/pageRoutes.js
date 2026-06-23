import express from "express";
import path from "path";
import { buscarUsuarioPorEmail } from "../models/userModel.js";

const router = express.Router();

// Página inicial
router.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "login.html"));
});

// Login
router.get("/login.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "login.html"));
});

// Cadastro
router.get("/cadastro.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "cadastro.html"));
});

// Redefinir senha
router.get("/redefinir.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "redefinir.html"));
});

// Trocar senha
router.get("./../views/trocarSenha.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "trocarSenha.html"));
});

// Disciplinas do módulo
router.get("/disciplinas.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views/disciplinas.html"));
});

// Trocar senha
router.get("/quiz", (req, res) => {
  res.sendFile(path.join(process.cwd(), "login.html"));
});

router.post("/login", async (req, res) => {

    console.log("LOGIN ACIONADO");

  try {

    console.log("BODY:", req.body);

    const { email, senha } = req.body;

    console.log("EMAIL:", email);
    console.log("SENHA:", senha);

    // procura usuário
    const usuario = 
      await buscarUsuarioPorEmail(email);

      console.log("USUARIO:", usuario)

    // se não encontrar
    if (!usuario || usuario.senha !==senha) {

      return res.status(401).json({
        success: false,
        message: "Email ou senha inválidos"
      });

    }

    // login OK
    return res.status(200).json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {

    console.log(erro);

    return res.status(500).json({
      success: false,
      message: "Erro no servidor"
    });
  }
});

export default router;