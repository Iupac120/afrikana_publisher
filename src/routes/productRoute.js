import express from "express";
const router = express.Router()
import { authenticateAdmin } from "../middleware/authorization.js";
import productController from "../controllers/productController.js";

router.post("/category",authenticateAdmin,productController.createCategory)
router.post("/listing",authenticateAdmin,productController.createProduct)

export {router}