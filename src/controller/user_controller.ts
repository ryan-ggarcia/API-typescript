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
    
    get_user(req: Request <{id: string}>, res: Response){
        const id = parseInt(req.params.id)
        if ( id >= 0 ){
            let find_user = user_list.find((find) => find.id == id)
            if ( find_user != undefined )
                res.status(201).json(find_user)
            else
                res.status(404).json("User not found...")
        }
        else
            res.status(404).json("Params not defined!")
    }

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
        if ( id >= 0 && name != " " ){
            let find_user = user_list.find((user) => user.id == id)
            if ( find_user != undefined){
                find_user.name = name
                res.status(201).json(user_list)
            }else
                res.status(404).json("Request not fold")
        }else
            res.status(400).json("Params not defined!")
    }

    delete(req: Request<{id: string}> , res: Response){
        const id = parseInt(req.params.id)
        if ( id >= 0 ){
           let find_user = user_list.find((user) => user.id == id)
           if ( find_user != undefined ){
            user_list = user_list.filter((user) => user.id != id)
            res.status(201).json(user_list)
           } else
            res.status(404).json("Params not defined")
        }  else
            res.status(404).json("Params not defined")
    }
}