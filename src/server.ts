import express from "express";
import UserRouter from "./router/user_router"

const app = express()
const port = 5000

app.use(express.json())
app.use("/user", UserRouter)

app.listen(port, ()=>{
    console.log(`Server on-line in  http://localhost:${port}/ `)
})