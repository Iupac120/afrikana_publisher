import express from "express";
const router =  express.Router()
import { trycatchHandler } from "../utils/trycatchHandler.js";
import cartController from "../controllers/cartItemController.js"
import { authenticateUser } from "../middleware/authorization.js";

router.post("/add/:productId",authenticateUser,trycatchHandler(cartController.addCart))
router.get("/",authenticateUser,trycatchHandler(cartController.getCart))
router.put("/update/:productId",authenticateUser,trycatchHandler(cartController.updateCart))
router.delete("/remove/:productId",authenticateUser,trycatchHandler(cartController.deleteCart))
router.post("/calculate-total/:productId",authenticateUser,trycatchHandler(cartController.cartTotal))

export{router}