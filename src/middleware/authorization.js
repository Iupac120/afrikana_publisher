import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

function authenticateUser (req,res,next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    console.log("token",token)
    if(token == null) return res.status(401).json({error:"error token"})
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded) => {
    if(err) return res.status(403).json(err.message)
    req.user = decoded
    console.log("authorization",req.user)
    next()
    })
}

export {authenticateUser}