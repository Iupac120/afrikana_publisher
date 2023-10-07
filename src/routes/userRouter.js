import express from "express"
const router = express.Router()
import userController from "../controllers/userController.js"
import { authenticateToken } from "../middleware/authorization.js"

router.get("/users",authenticateToken, userController.getUser)
router.post("/",userController.createUser)

export default router