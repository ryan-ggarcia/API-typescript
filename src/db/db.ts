import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise"

export default class Database {

    // pool compartilhado por todas as instâncias: criado uma vez, quando a classe carrega
    static #pool: Pool = mysql.createPool({
        host: '132.226.245.178', //endereço do nosso banco de dados na nuvem
            database: 'PFS2_10442519210', //a database de cada um de vocês possui a nomenclatura PFS2_(RA)
            user: '10442519210', // usuario e senha de cada um de vocês é o RA
            password: '10442519210',
            idleTimeout: 30000,
            connectionLimit: 50
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
