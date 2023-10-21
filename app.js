import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport";
import "./src/utils/passport.js"
import cookieSession from "cookie-session";
import expressSession from 'express-session';
import {dirname, join} from "path"
import { fileURLToPath } from "url"
import {router as userRoute} from "./src/routes/userRoute.js"
import {router as authRoute} from "./src/routes/registerRoute.js"
import {router as productRoute} from "./src/routes/productRoute.js"
import { notFound } from "./src/errors/NotFoundError.js"
import { errorHandler } from "./src/errors/errorHandler.js"
import pool from "./src/database/db.js"
const _dirname  = dirname(fileURLToPath(import.meta.url))
app.use(express.json())
const corsOptions = {
    Credential: true, 
    origin: process.env.CLIENT_URL || '*',
    methods:"GET,POST,PUT,DELETE"
    }
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(morgan())
app.use(
    expressSession({
        secret:"mySecret",
        resave: false,
        saveUninitialized: true,
        cookie:{secure: false}, //set true on https
        maxAge:24*60*60*1000
    })
)
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 5000
app.use(cookieParser())
app.use("/api/user", userRoute)
app.use("/api/register", authRoute)
app.use("/api/product", productRoute)


app.use(notFound)
app.use(errorHandler)
const start = async () => {
    await console.log(pool.options)
    app.listen(port, () => {
        console.log(`app is listening to port ${port}`)
    })
}
start()