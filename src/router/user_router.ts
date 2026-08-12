import express from "express";
import UserController from "../controller/user_controller";

const router = express.Router()
let controller = new UserController()
router.get("/", controller.list)

export default router