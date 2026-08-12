import { type Request, type Response,} from "express";

interface User{
    id: number,
    name: string
}
// Garante que o array tenha apenas os objetos do tipo User
// Cria um array 
let user_list: User[] = [{ 
    id: 1,
    name:"Hello world"
}]

export default class UserController{
    list(_req: Request,res: Response){
        res.status(200).json(user_list)
    }
}