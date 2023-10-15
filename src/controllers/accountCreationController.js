
import bcrypt from "bcrypt";
import pool from "../database/db.js";
import { jwtToken } from "../utils/jwt.js";
import passport from "passport";
import { sendMail } from "../utils/email.js";
import {otp} from "../utils/otp.js"
import { NotFoundError,UnAuthorizedError } from "../errors/customError.js";


const createUser = async (req,res) => {
        const {userName,email,password} = req.body
        const isEmail = await pool.query("SELECT user_email FROM users WHERE user_email = $1",[email])
        if(isEmail.rows.length) return res.status(401).json("Emails exist please sign in")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const otpCode = otp().toString()
        const otpTime = Date.now() + 1800000
        console.log("otpTime",otpTime)
        const hashedOtpCode = await bcrypt.hash(otpCode,10)
        const newUser = await pool.query("INSERT INTO users (user_name,user_email,user_password,otp,otp_time) VALUES ($1,$2,$3,$4,$5) RETURNING *",[userName,email,hashedPassword,hashedOtpCode,otpTime])
        const message  =`<p>Please enter ${otpCode} to verify email and complete sign up.</p>
        <p>This code <b>expires in 30 minutes.</b></p> 
         <p>Press <a href="https://localhost:3000">here</a> to proceed.</p>                                                               
         `;
        const subject = "OTP VERIFICATION"
        await sendMail(email,subject,message)
        res.status(201).json({user:newUser.rows[0]})
}

const verifyOtp = async (req,res) => {
    const {otp,email} = req.body
    const user = await pool.query("SELECT otp FROM users WHERE user_email = $1",[email])
    if(!user.rows.length) return next(new NotFoundError("Server error"))
    const isOtpValid = user.rows[0]
    if(Date.now() > isOtpValid) return next(new UnAuthorizedError("Otp has expired"))
}

const userLogin = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await pool.query("SELECT user_email FROM users WHERE user_email = $1",[email])
        if(user.rows.length === 0) return res.status(401).json({error:"email not found, please sign up"})
        const isMatch =  await bcrypt.compare(password, user.rows[0].user_password)
        if(!isMatch) return res.status(401).json({error:"Incorrect password"})
        let token = jwtToken(user.rows[0]);
    //httpOnly: true, sameSite:"none", secure: true
        res.cookie("refresh_token",token.refreshToken,{httpOnly: true})
        res.status(201).json(token)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const refreshLogin = async (req,res) => {
    try {
        const refreshToken = req.cookies.refresh_token
        if(refreshToken === null) return res.status(401).json({error:"refresh is null"})
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN,(err,user) => {
        if(err) return res.status(403).json({error:err.message})
        let token = jwtToken(user)
        res.cookie("refresh_token",token.refreshToken,{httpOnly: true});
        res.status(201).json(token)
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const logout = async (req,res) => {
    try {
        res.clearCookie("refresh_token")
        res.status(200).json({message:"user log out"})
    } catch (error) {
        res.status(500).json(err.message)
    }
}

const googleLogin = function (){
    passport.authenticate("google",{
        successRedirect:process.env.CLIENT_URL,
        failureRedirect:"/login/failed"
    })
}
const facebookLogin =  function (){
    passport.authenticate("facebook",{
        successRedirect:process.env.CLIENT_URL,
        failureRedirect:"/login/failed"
    })
}

const loginFailure = (req,res) => {
    res.status(401).json({
        error:true,
        message:"login failure"
    })
}

export default {
    createUser,
    userLogin,
    refreshLogin,
    logout,
    googleLogin,
    facebookLogin,
    loginFailure
}