export default class PerfilModel {
    private per_id: number;
    private per_descricao: string;

    constructor(per_descricao: string, per_id: number = 0) {
        this.per_id = per_id;
        this.per_descricao = per_descricao;
    }

    get id(): number { return this.per_id; }
    set id(valor: number) { this.per_id = valor; }

    get descricao(): string { return this.per_descricao; }
    set descricao(valor: string) { this.per_descricao = valor; }

    static Map(entity: { per_id:number, per_descricao:string } ): PerfilModel {
         return new PerfilModel(entity.per_descricao, entity.per_id);
    }

    toJson(){
        return {
            per_id: this.per_id,
            per_descricao: this.per_descricao,
        }
    }

    Validar(): boolean{
        if(typeof this.per_descricao !== "string" || this.per_descricao.trim() === "")
            return false
        return true
    }
}