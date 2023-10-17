import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

function jwtToken ({name:user_name,id:user_id,email:user_email}){
    const user = {name:user_name,id:user_id,email:user_email}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:"2d"});
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN,{expiresIn:"1y"})
    return {accessToken,refreshToken}
}
 export {jwtToken}