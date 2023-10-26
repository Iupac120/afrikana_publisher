import express from "express";
const router =  express.Router()
import { trycatchHandler } from "../utils/trycatchHandler.js";
import cartController from "../controllers/cartItemController.js"
import { authenticateUser } from "../middleware/authorization.js";

router.post("/add/:productId",authenticateUser,trycatchHandler(cartController.addCart))

export{router}