import express from "express"
const router = express.Router()
import userController from "../controllers/profileCreationController.js"
import { authenticateUser } from "../middleware/authorization.js"
import upload from "../middleware/multer.js"

router.get("/users",authenticateUser, userController.getUser)
router.post("/profile",authenticateUser,userController.updateProfileName)
router.post("/avatar",authenticateUser,upload.single('image'),userController.uploadProfileImage)
router.get("/avatar",authenticateUser,userController.getUserProfileImage)
router.put("/display-mode",authenticateUser,userController.displayModeToggle)
router.put("/password",authenticateUser,userController.updateUserPassword)
router.put("/email-preference",authenticateUser,userController.updateUserEmail)
router.post("/earnings",authenticateUser,userController.createEarning)
router.get("/earnings",authenticateUser,userController.getEarning)

export {router}