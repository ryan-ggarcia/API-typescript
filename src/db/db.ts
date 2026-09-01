import mysql, { type ResultSetHeader } from "mysql2"

export default class Database {

    #conexao;

    get conexao() { return this.#conexao;} set conexao(conexao) { this.#conexao = conexao; }

    constructor() {

        this.#conexao = mysql.createPool({
            host: '132.226.245.178', //endereço do nosso banco de dados na nuvem
            database: 'db-aula', //a database de cada um de vocês possui a nomenclatura PFS2_(RA)
            user: '10442519210', // usuario e senha de cada um de vocês é o RA
            password: '10442519210',
            idleTimeout: 30000,
            connectionLimit: 50
        });
    }

    ExecutaComando(sql:string, valores:any[]) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }
    
    ExecutaComandoNonQuery(sql:string, valores:any[]) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res((results as ResultSetHeader).affectedRows);
            });
        })
    }

    ExecutaComandoLastInserted(sql:string, valores:any[]) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(( results as ResultSetHeader).insertId);
            });
        })
    }

}