import express from "express"
const router = express.Router()
import orderController from "../controllers/orderController.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { authenticateUser } from "../middleware/authorization.js"

router.get("/",authenticateUser,trycatchHandler(orderController.getOrder))

export{router}