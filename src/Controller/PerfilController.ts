import type { IPerfilModel } from "../DAO/IDAO.ts";
import PerfilModel from "../Model/PerfilModel.ts";
import { type Request, type Response } from "express";

export default class PeriflController {
    private Idao: IPerfilModel;

    constructor(Idao: IPerfilModel) {
        this.Idao = Idao;
    }

    async Create(req: Request, res: Response) {
        try {
            const { descricao } = req.body
            const perfil = new PerfilModel(descricao, 0)
            if (perfil.Validar()) {
                let newPrefil = await this.Idao.Create(perfil)
                if (newPrefil)
                    return res.status(200).json({ message: `Sucesso! Perfil ${newPrefil} foi cadastrado.` })
                return res.status(400).json({ message: "Erro. Não foi possível realizar o cadastro." })
            }
            return res.status(404).json({ message: "Alguns campos não foram preenchidos corretamente." })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Erro. Tente novamente mais tarde." })
        }
    }

    async Read(req: Request<{id:string}>, res: Response) {
        try {
            const id = Number(req.params.id)
            const perfil = new PerfilModel("", id)
            if (id > 0) {
                let readPerfil = await this.Idao.Read(perfil.id)
                if (readPerfil)
                    return res.status(200).json(readPerfil)
                return res.status(400).json({ message: "Erro. Não foi possível buscar o perfil." })
            }
            return res.status(404).json({ message: "Alguns campos não foram preenchidos corretamente." })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Erro. Tente novamente mais tarde." })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            const { id, descricao } = req.body
            const perfil = new PerfilModel(descricao, id)
            if (perfil.Validar()) {
                let updatePerfil = await this.Idao.Update(perfil)
                if (updatePerfil)
                    return res.status(201).json({ message: "Sucesso! Perfil Atualizado" })
                return res.status(400).json("Erro. Não foi possível atualizar o Perfil.")
            }
            return res.status(404).json({ message: "Alguns campos não foram preenchidos corretamente." })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Erro. Tente novamente mais tarde." })
        }
    }

    async Delete(req: Request<{id:string}>, res: Response) {
        try {
            const id  = Number(req.params.id)
            const perfil = new PerfilModel("", id)
            if (perfil.id > 0) {
                let deletePerfil = await this.Idao.Delete(perfil.id)
                if (deletePerfil)
                    return res.status(201).json({ message: "Perfil excluido com sucesso" })
                return res.status(400).json({ message: "Erro... Não foi possível excluir a conta" })
            }
            return res.status(404).json({ message: "Alguns campos não foram preenchidos corretamente." })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Erro. Tente novamente mais tarde." })
        }
    }
    
    async List(_req: Request, res: Response) {
        try {
            let listaPerfil = await this.Idao.List()
            res.status(200).json(listaPerfil)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Erro. Tente novamente mais tarde." })
        }
    }
}