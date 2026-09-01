import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise"

export default class Database {

    // pool compartilhado por todas as instâncias: criado uma vez, quando a classe carrega
    static #pool: Pool = mysql.createPool({
        host: process.env.DB_HOST,          // endereço do banco na nuvem
        database: process.env.DB_NAME,      // PFS2_(RA)
        user: process.env.DB_USER,          // RA
        password: process.env.DB_PASSWORD,  // RA
        idleTimeout: 30000,
        connectionLimit: 50,
    });

    async ExecutaComando(sql: string, valores: any[]): Promise<RowDataPacket[]> {
        const [linhas] = await Database.#pool.execute<RowDataPacket[]>(sql, valores);
        return linhas;
    }

    async ExecutaComandoNonQuery(sql: string, valores: any[]): Promise<number> {
        const [resultado] = await Database.#pool.execute<ResultSetHeader>(sql, valores);
        return resultado.affectedRows;
    }

    async ExecutaComandoLastInserted(sql: string, valores: any[]): Promise<number> {
        const [resultado] = await Database.#pool.execute<ResultSetHeader>(sql, valores);
        return resultado.insertId;
    }

}
