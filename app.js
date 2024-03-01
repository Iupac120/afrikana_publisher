import express from "express"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path, {dirname} from "path";
dotenv.config()
const app = express()
import {createServer} from "http";
import {Server} from "socket.io";
const httpServer = createServer(app);
const io = new Server(httpServer,{cors:{origin:'*'}});
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport";
import "./src/utils/passport.js"
import cookieSession from "cookie-session";
import expressSession from 'express-session';
import pgSession from "connect-pg-simple";
import {router as userRoute} from "./src/routes/userRoute.js"
import {router as authRoute} from "./src/routes/registerRoute.js"
import {router as productRoute} from "./src/routes/productRoute.js"
import {router as artworkRoute} from "./src/routes/artworkRoute.js"
import {router as cartRoute} from "./src/routes/cartRoute.js"
import {router as paymentRoute} from "./src/controllers/paymentController.js"
import {router as orderRoute} from "./src/routes/orderRoute.js"
import {router as mediaRoute} from "./src/routes/multiMediaRoute.js"
import { notFound } from "./src/errors/NotFoundError.js"
import { errorHandler } from "./src/errors/errorHandler.js"
import pool from "./src/database/db.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
app.use(express.json())
const corsOptions = {
    origin: ["http://localhost:3000", `${process.env.CLIENT_URL}`], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions))
app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static('public'))
console.log('this is path',path.join(__dirname,'views'))
app.use(morgan())
app.use(
    expressSession({
        // store:new (pgSession(expressSession))({
        //     pool:pool
        // }),
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
app.use("/api/artwork", artworkRoute)
app.use("/api/cart", cartRoute)
app.use("/api/payment",paymentRoute)
app.use("/api/order",orderRoute)
app.use("/api/media",mediaRoute)

//app.use(notFound)
//app.use(errorHandler)

io.on('connection', socket => {
    socket.on('join-room',(roomId,userId) => {
      console.log(roomId,userId)
    })
  })


const start = async () => {
    await console.log(pool.options)
    app.listen(port, () => {
        console.log(`app is listening to port ${port}`)
    })
}
start()