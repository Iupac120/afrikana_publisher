import express from "express"
const router = express.Router()
import multiMediaController from "../controllers/multiMediaController.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { authenticateUser } from "../middleware/authorization.js"
import upload from "../middleware/multer.js"


router.post("/texts",authenticateUser,trycatchHandler(multiMediaController.createText))
router.post("/chat/create-room",authenticateUser,trycatchHandler(multiMediaController.createChatRoom))
router.get("/chat/rooms",authenticateUser,trycatchHandler(multiMediaController.getChatRoom))
router.post("/content/upload/video",upload.single('video'),trycatchHandler(multiMediaController.createVideo))
router.post("/content/upload/audio",upload.single('audio'),trycatchHandler(multiMediaController.createAudio))
router.get("/content/aggregator",trycatchHandler(multiMediaController.displayImage))
router.post("/chat/rooms/:room_id/messages",authenticateUser,trycatchHandler(multiMediaController.shareChatRoomMessage))
router.get("/texts/:text_id",trycatchHandler(multiMediaController.getTextId))
router.post("/texts/:text_id/likes",authenticateUser,trycatchHandler(multiMediaController.createLikeText))
router.post("/texts/:text_id/comments",authenticateUser,trycatchHandler(multiMediaController.createComment))
router.post("/texts/:text_id/user-mentions",authenticateUser,trycatchHandler(multiMediaController.createUserComment))
router.post("/texts/:text_id/emoji-gif",trycatchHandler(multiMediaController.createEmoji))
router.post("/texts/:text_id/report",authenticateUser,trycatchHandler(multiMediaController.createReport))
router.get("/content/:content_id",trycatchHandler(multiMediaController.getContent))
router.get("/content/sort",trycatchHandler(multiMediaController.sortContent))
router.get("/content/display/slideshow",trycatchHandler(multiMediaController.displayContentSlideshow))
router.get("/content/display/carousel",trycatchHandler(multiMediaController.displayCarousel))
router.post("/content/recommendations",trycatchHandler(multiMediaController.createRecommendation))
router.post("/content/share",trycatchHandler(multiMediaController.createContentLink))
router.post("/content/categorization",trycatchHandler(multiMediaController.contentCategorization))

export {router}