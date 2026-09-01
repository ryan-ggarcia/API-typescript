import Database from "../db/db.ts";
import PerfilModel from "../Model/PerfilModel.ts";
import type { IDAO } from "./IDAO.ts";

type LinhaPerfil = {per_id: number, per_descricao:string}

export default class PerfilDAO implements IDAO<PerfilModel>{
    private db: Database;
    constructor(db: Database){ this.db = db };

    async Create(entity:PerfilModel): Promise<number>{
        const query = "INSERT per_descricao into tb_perfil value (?)";
        const value = [entity.descricao];
        let result = await this.db.ExecutaComandoLastInserted(query,value);
        return result > 0 ? result : 0;
    }

    async Read(id: number): Promise<false | PerfilModel> {
        const query = "SELECT * FROM tb_perfil WHERE per_id = ?"
        const value = [id]
        let row = await this.db.ExecutaComando(query,value) as LinhaPerfil[]
        return row.length > 0 ? PerfilModel.Map(row[0]) : false 
    }

    async Update(entity: PerfilModel): Promise<boolean> {
        const query = "UPDATE tb_perfil SET per_descricao = ? WHERE per_id = ?"
        const value = [entity.id, entity.descricao]
        let result = await this.db.ExecutaComandoNonQuery(query,value)
        return result ? true : false
    }

    async Delete(id: number): Promise<boolean> {
        const query = "DELETE FROM tb_perfil WHERE per_id = ?"
        const value = [id]
        let result = await this.db.ExecutaComandoNonQuery(query,value)
        return result ? true : false
    }
    
    async List(): Promise<PerfilModel[]> {
        const query = "SELECT * FROM tb_perfil"
        let rows = await this.db.ExecutaComando(query, []) as LinhaPerfil[];
        return rows.map(row => PerfilModel.Map(row) )
    }
}