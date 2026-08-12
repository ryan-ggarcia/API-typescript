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

    insert(req: Request, res: Response){
        const {name} = req.body
        if ( name ){
            let new_user = { id: Date.now(), name: name }
            user_list.push(new_user)
            res.status(201).json(user_list)
        }else
            res.status(400).json("Params not defined!")
    }

    update(req: Request, res: Response){
        const {id, name} = req.body
        if ( id != null && id != undefined){
            let find_user = user_list.find((user) => user.id == id)
            if ( find_user != undefined){
                find_user.name = name
                res.status(201).json(user_list)
            }else
                res.status(500).json("Request not fold")
        }else
            res.status(400).json("Params not defined!")
    }

    delete(req: Request, res: Response){
        const {id} = req.body
        if ( id != null && id != undefined ){
            user_list = user_list.filter((user) => user.id != id)
            if (user_list.find((user) => user.id != id))
                res.status(201).json(user_list)
            else
                res.status(500).json("Request not fold") 
        }  else
            res.status(400).json("Params not defined")
    }
}