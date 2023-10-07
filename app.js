import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
import cookieParser from "cookie-parser"
import cors from "cors"
import {dirname, join} from "path"
import { fileURLToPath } from "url"
const _dirname  = dirname(fileURLToPath(import.meta.url))
app.use(express.json())
const corsOptions = {Credential: true, origin: process.env.URL || '*'}
app.use(cors(corsOptions))
app.use(express.static('public'))
import {router as userRoute} from "./src/routes/userRouter.js"


const port = process.env.PORT || 5000
app.use(cookieParser())
app.use("/api/v1/user", userRoute)
app.listen(port, () => {
    console.log(`app is listening to port ${port}`)
})
