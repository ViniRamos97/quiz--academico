import express from "express";
import {
    getTelaMudulo,
    getModuloById,
    getDisciplinasPorModulo,
    getDisciplinasPage,
    getInfoModulo,
    getTodosModulos
} from "../controllers/moduloController.js";

const router = express.Router();

// Servir a página tela_modulo.html
router.get("/", getTelaMudulo);

// Servir a página de disciplinas de um módulo específico
router.get("/disciplinas/:id", getDisciplinasPage);

// Buscar todos os módulos disponíveis (deve vir antes de /:id para evitar conflito)
router.get("/api/todos", getTodosModulos);

// Buscar todas as disciplinas de um módulo específico (API)
router.get("/:id/disciplinas", getDisciplinasPorModulo);

// Buscar informações de um módulo
router.get("/:id/info", getInfoModulo);

// Buscar módulo e suas disciplinas (deve vir por último)
router.get("/:id", getModuloById);

export default router;
