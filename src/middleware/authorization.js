import jwt from "jsonwebtoken"

function authenticateToken (req,res,next) {
    const authHeader = req.header.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({error:"error token"})
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded) => {
    if(err) return res.status(403).json(er.message)
    req.user = decoded
    next()
    })
}

export {authenticateToken}