import express from "express";
const router = express.Router()
import authController from "../controllers/authController.js"
router.post("/login", authController.userLogin)
router.post("/refresh", authController.refreshLogin)
router.post("/logout", authController.logout)
router.get("/google/callback", authController.googleLogin)
router.get("/facebook/callback", authController.googleLogin)
router.get("/login/failed", authController.loginFailure)

export  {router}