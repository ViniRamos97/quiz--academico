import { pool } from "../config/database.js";

export const buscarDisciplinasPorModulo = async (numeroModulo) => {
    const [rows] = await pool.execute(`
        SELECT 
            id,
            nome,
            modulo,
            sigla
        FROM disciplina
        WHERE modulo = ?
        ORDER BY id
    `, [numeroModulo]);

    return rows;
};

export const buscarInfoModulo = async (numeroModulo) => {
    const [rows] = await pool.execute(`
        SELECT 
            modulo,
            COUNT(*) as totalDisciplinas,
            GROUP_CONCAT(nome, ', ') as disciplinas
        FROM disciplina
        WHERE modulo = ?
        GROUP BY modulo
    `, [numeroModulo]);

    return rows[0] || null;
};

export const buscarTodosModulos = async () => {
    const [rows] = await pool.execute(`
        SELECT DISTINCT modulo
        FROM disciplina
        ORDER BY modulo
    `);

    return rows;
};
