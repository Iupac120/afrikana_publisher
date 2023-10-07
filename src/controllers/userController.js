import express from "express"
import pool from "../database/db.js"

export const getUser = async (req,res) => {
    try {
        const users = await pool.query("SELECT * FROM users")
        res.staus(200).json({users:users.rows})
    } catch (error) {
        res.staus(500).json(error.message)
    }
}