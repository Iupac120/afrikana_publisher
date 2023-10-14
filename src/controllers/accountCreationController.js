import express from "express";
import bcrypt from "bcrypt";
import pool from "../database/db.js";
import { jwtToken } from "../utils/jwt.js";
import passport from "passport";


const createUser = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await pool.query("INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",[req.body.name,req.body.email,hashedPassword])
        res.status(201).json({user:newUser.rows[0]})
    } catch (error) {
        res.status(500).json(error.message)
    }

}

const userLogin = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email])
        if(user.rows.length === 0) return res.status(401).json({error:"email not found"})
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