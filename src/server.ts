import express from "express"
import PerfilRouter from "./Router/PerfilRouter.ts"

const app = express()
const port = 5000

app.use(express.json())

app.use("/perfil", PerfilRouter)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
