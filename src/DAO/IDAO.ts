import type PerfilModel from "../Model/PerfilModel.ts";

export interface IPerfilModel{
    Create(entity: PerfilModel): Promise<number>;
    Read(id: number): Promise<PerfilModel | false> ;
    Update(entity: PerfilModel): Promise<boolean> ;
    Delete(id: number): Promise<boolean> ;
    List(): Promise<PerfilModel[]> ;
}