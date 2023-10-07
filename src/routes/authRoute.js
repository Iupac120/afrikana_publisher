import express from "express";
const router = express.Router()
import authController from "../controllers/authController.js"
router.post("/login", authController.userLogin)
router.post("/refresh", authController.refreshLogin)
router.post("/logout", authController.logout)

export default router