import express from "express";
import bcrypt from "bcrypt";
import pool from "../database/db";
import { jwtToken } from "../utils/jwt";

const userLogin = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email])
        if(user.rows.length === 0) return res.status(401).json({error:"email not found"})
        const isMatch =  await bcrypt.compare(password, user.rows[0].user_password)
        if(!isMatch) return res.status(401).json({error:"Incorrect password"})
        let token = jwtToken(user.rows[0]);
        res.cookie("refresh_token",token.refreshToken,{httpOnly: true})
        res.status(201).json(token)
    } catch (error) {
        res.status(500).json(error.message)
    }
}