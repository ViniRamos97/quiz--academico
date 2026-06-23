import path from "path";
import { buscarDisciplinasPorModulo, buscarInfoModulo, buscarTodosModulos } from "../models/moduloModel.js";

export async function getTelaMudulo(req, res) {
    try {
        res.sendFile(path.join(process.cwd(), "views/tela_modulo.html"));
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao carregar tela de módulos" });
    }
}

export async function getModuloById(req, res) {
    try {
        const { id } = req.params;

        if (!id || id < 1 || id > 3) {
            return res.status(400).json({ erro: "ID de módulo inválido" });
        }

        const disciplinas = await buscarDisciplinasPorModulo(id);

        if (disciplinas.length === 0) {
            return res.status(404).json({ erro: "Nenhuma disciplina encontrada para este módulo" });
        }

        res.status(200).json({
            modulo: id,
            disciplinas: disciplinas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao buscar módulo" });
    }
}

export async function getDisciplinasPorModulo(req, res) {
    try {
        const { id } = req.params;

        if (!id || id < 1 || id > 3) {
            return res.status(400).json({ erro: "ID de módulo inválido" });
        }

        const disciplinas = await buscarDisciplinasPorModulo(id);

        if (disciplinas.length === 0) {
            return res.status(404).json({ erro: "Nenhuma disciplina encontrada para este módulo" });
        }

        res.status(200).json({
            modulo: id,
            disciplinas: disciplinas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao buscar disciplinas do módulo" });
    }
}

export async function getInfoModulo(req, res) {
    try {
        const { id } = req.params;

        if (!id || id < 1 || id > 3) {
            return res.status(400).json({ erro: "ID de módulo inválido" });
        }

        const info = await buscarInfoModulo(id);

        if (!info) {
            return res.status(404).json({ erro: "Módulo não encontrado" });
        }

        res.status(200).json(info);
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao buscar informações do módulo" });
    }
}

export async function getDisciplinasPage(req, res) {
    try {
        const { id } = req.params;

        if (!id || id < 1 || id > 3) {
            return res.status(400).send("ID de módulo inválido");
        }

        res.sendFile(path.join(process.cwd(), "views/disciplinas.html"));
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao carregar a página de disciplinas" });
    }
}

export async function getTodosModulos(req, res) {
    try {
        const modulos = await buscarTodosModulos();

        res.status(200).json({
            total: modulos.length,
            modulos: modulos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ erro: "Erro ao buscar módulos" });
    }
}
