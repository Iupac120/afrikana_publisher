import express from "express";
const router =  express.Router()
import { trycatchHandler } from "../utils/trycatchHandler.js";
import artworkContoller from "../controllers/artworkContoller.js";


router.get("/", trycatchHandler(artworkContoller.getArtWorks))
router.get("/collections", trycatchHandler(artworkContoller.getCollection))
router.get("/filter", trycatchHandler(artworkContoller.filterArtwork))
router.get("/sort", trycatchHandler(artworkContoller.sortArtwork))
router.get("/:colId/sub-collection", trycatchHandler(artworkContoller.getSpecificArtWork))
router.get("/:artworkId", trycatchHandler(artworkContoller.getSpecificArtWork))
router.get("/:artworkId/details", trycatchHandler(artworkContoller.getSpecificArtWorkDetails))
export {router}