import { profile } from "node:console";
import PerfilModel from "./PerfilModel.ts";

export default class UsuModel{
    private usu_id: number;
    private usu_nome: string;
    private usu_email: string;
    private usu_ativo: boolean;
    private usu_senha: string;
    private usu_perfil: PerfilModel;

    constructor( usu_id: number = 0, usu_nome: string, usu_email: string, usu_ativo: boolean, usu_senha: string, usu_perfil: PerfilModel,){
        this.usu_id = usu_id;
        this.usu_nome = usu_nome;
        this.usu_email = usu_email;
        this.usu_ativo = usu_ativo;
        this.usu_senha = usu_senha;
        this.usu_perfil = usu_perfil;
    }

    get id(): number { return this.usu_id; }
    get nome(): string { return this.usu_nome; }
    get email(): string { return this.usu_email; }
    get ativo(): boolean { return this.usu_ativo; }
    get senha(): string { return this.usu_senha; }
    get perfil(): PerfilModel { return this.usu_perfil; }

    set id(valor: number) { this.usu_id = valor; }
    set nome(valor: string) { this.usu_nome = valor; }
    set email(valor: string) { this.usu_email = valor; }
    set ativo(valor: boolean) { this.usu_ativo = valor; }
    set senha(valor: string) { this.usu_senha = valor; }
    set perfil(valor: PerfilModel) { this.usu_perfil = valor; }

    static Map(entity: {id:number,nome:string,email:string,ativo:boolean,senha:string,perfil:PerfilModel}): UsuModel {
        return new UsuModel(entity.id,entity.nome,entity.email,entity.ativo,entity.senha, new PerfilModel("", entity.id) )
    }

    Validar(){
        if( this.nome.trim() === "" &&  this.email.trim() === "" && typeof this.ativo !== "boolean" && this.senha.trim() === "" && !(this.perfil instanceof PerfilModel) )
            return false
        return true
    }

    toJSON(){
        return{
            usu_id: this.usu_id,
            usu_nome: this.usu_nome,
            usu_email: this.usu_email,
            usu_ativo: this.usu_ativo,
            usu_senha: this.usu_senha,
            usu_perfil: this.usu_perfil
        }
    }
}