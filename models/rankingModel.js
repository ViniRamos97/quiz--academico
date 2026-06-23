import { pool } from "../config/database.js";

export async function buscarRanking() {

    const [rows] = await pool.query(`

        SELECT
            nome,
            pontuacao

        FROM usuario

        ORDER BY pontuacao DESC

        LIMIT 10

    `);

    return rows;
}

export async function salvarPontuacao(
    nome,
    pontos
) {
// 
    await pool.query(`

        UPDATE usuario

       SET pontuacao = ?

        WHERE nome = ?

    `, [pontos, nome]);
}