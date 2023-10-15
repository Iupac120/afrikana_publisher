import express from "express";
const router = express.Router()
import authController from "../controllers/accountCreationController.js"
import { trycatchHandler } from "../utils/trycatchHandler.js";

router.post("/",trycatchHandler(authController.createUser))
router.post("/login", authController.userLogin)
router.post("/refresh", authController.refreshLogin)
router.post("/logout", authController.logout)
router.get("/google/callback", authController.googleLogin)
router.get("/facebook/callback", authController.facebookLogin)
router.get("/login/failed", authController.loginFailure)

export  {router}