import express from "express";
const router = express.Router()
import { authenticateAdmin } from "../middleware/authorization.js";
import { trycatchHandler } from "../utils/trycatchHandler.js";
import productController from "../controllers/productController.js";

router.post("/category",authenticateAdmin,trycatchHandler(productController.createCategory))
router.post("/sub-category",authenticateAdmin,trycatchHandler(productController.createSubCategory))
router.post("/listing",authenticateAdmin,trycatchHandler(productController.createProduct))

export {router}