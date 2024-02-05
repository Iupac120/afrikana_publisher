import express from "express"
const router = express.Router()
import multiMediaController from "../controllers/multiMediaController.js"
import { trycatchHandler } from "../utils/trycatchHandler.js"
import { authenticateUser } from "../middleware/authorization.js"


router.post("/texts",authenticateUser,trycatchHandler(multiMediaController.createText))
router.post("/chat/create-room",trycatchHandler(multiMediaController.createChatRoom))
router.get("/chat/rooms",trycatchHandler(multiMediaController.getChatRoom))
router.post("/content/upload/video",trycatchHandler(multiMediaController.createVideo))
router.post("/content/upload/audio",trycatchHandler(multiMediaController.createAudio))
router.get("/content/aggregator",trycatchHandler(multiMediaController.displayImage))
router.post("/chat/rooms/:room_id/messages",trycatchHandler(multiMediaController.shareChatRoomMessage))
router.get("/texts/:text_id",trycatchHandler(multiMediaController.getTextId))
router.post("/texts/:text_id/likes",authenticateUser,trycatchHandler(multiMediaController.createLikeText))
router.post("/texts/:text_id/comments",trycatchHandler(multiMediaController.createComment))
router.post("/texts/:text_id/user-mentions",trycatchHandler(multiMediaController.createUserComment))
router.post("/texts/:text_id/emoji-gif",trycatchHandler(multiMediaController.createEmoji))
router.post("/texts/:text_id/report",trycatchHandler(multiMediaController.createReport))
router.get("/content/:content_id",trycatchHandler(multiMediaController.createContent))
router.get("/content/sort",trycatchHandler(multiMediaController.sortContent))
router.get("/content/display/slideshow",trycatchHandler(multiMediaController.displayContentSlideshow))
router.get("/content/display/carousel",trycatchHandler(multiMediaController.displayCarousel))
router.post("/content/recommendations",trycatchHandler(multiMediaController.createRecommendation))
router.post("/content/share",trycatchHandler(multiMediaController.createContentLink))
router.post("/content/categorization",trycatchHandler(multiMediaController.contentCategorization))

export {router}