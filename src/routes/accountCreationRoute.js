import express from "express";
import passport from "passport"
const router = express.Router()
import authController from "../controllers/accountCreationController.js"
import { trycatchHandler } from "../utils/trycatchHandler.js";

router.post("/", trycatchHandler(authController.createUser))
router.post("/verify-otp", trycatchHandler(authController.verifyOtp))
router.post("/reset-verify-otp", trycatchHandler(authController.resetOtpVerify))
router.post("/login", trycatchHandler(authController.userLogin))
router.post("/reset-password-link", trycatchHandler(authController.resetPasswordLink))
router.post("/reset-password", trycatchHandler(authController.resetPassword))
router.get("/refresh", authController.refreshLogin)
router.get("/logout", authController.logout)
router.get("/social/google/callback", passport.authenticate("google",{scope:['profile email']}))
//router.get("/social/google/callback", authController.googleLogin)
router.get("/social/facebook/callback", authController.facebookLogin)
router.get("/login/failed", authController.loginFailure)

export  {router}