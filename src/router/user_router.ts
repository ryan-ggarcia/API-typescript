import express from "express";
import UserController from "../controller/user_controller";

const router = express.Router()
let controller = new UserController()

router.get("/", controller.list)
router.post("/", controller.insert)
router.put("/", controller.update)
router.delete("/:id", controller.delete)
router.get("/:id", controller.get_user)

export default router