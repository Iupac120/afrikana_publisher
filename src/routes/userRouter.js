import express from "express"
const router = express.Router()
import userController from "../controllers/userController.js"

router.get("/users",userController.getUser)

export default router