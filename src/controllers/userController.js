import express from "express";
import bcrypt from "bcrypt";
import pool from "../database/db.js"
import cloudinary from "../utils/cloudinary.js";

const getUser = async (req,res) => {
    try {
        const users = await pool.query("SELECT * FROM users")
        res.staus(200).json({users:users.rows})
    } catch (error) {
        res.staus(500).json(error.message)
    }
}

const createUser = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await pool.query("INSERT INTO users (user_name,user_email,user_password,created_at,updated_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",[req.body.name,req.body.email,hashedPassword,Date.now(),Date.now()])
        res.status(201).json({user:newUser.rows[0]})
    } catch (error) {
        res.status(500).json(error.message)
    }

}

const updateImage = async (req,res) => {
    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json("No file to upload")
    }

    sampleFile = req.files.sampleFile
    uploadPath = __dirname + "/upload" + sampleFile.name;

    sampleFile.mv(uploadPath , async function (err){
        if(err) return res.status(401).json("upload faile")
        await pool.query("UPDATE users SET profile_image = $1 WHERE user_id =$2",[sampleFile.name,])
        res.send("upload successful")
    })
}

const updateProfileName = async (req,res) => {
    const {firstName, lastName} = req.body
    const userId = req.user.id
   const names = await pool.query("UPDATE users SET first_name = $1, last_name = $2, updated_at = $3 WHERE user_id = $4",[firstName,lastName,Date.now(),userId])
   if(!names.rows.length){
    return res.status(500).json("Failed to update")
   }
    res.status(201).json({sucees: true, data:names.rows[0]})
}

const uploadProfileImage = async (req,res) => {
    //const {image} = req.body
    const userId = req.user.id //authorization middleware
    cloudinary.uploader.upload(req.file.path,{
        folder:"profile",
        width: 300,
        crop:"scale"
    }, async function (err,result){
        if(err){
            console.log(err)
            return res.status(500).json({
                success: false,
                message:"Error"
            })
        }
        const public_id = result.public_id
        const image_url = result.url
        const imageId = await pool.query("INSERT INTO profile_image (public_id,image_url,created_at,updated_at) VALUES ($1,$2,$3,$4) RETURNING image_id",[public_id,image_url,Date.now(),Date.now()])
        comsole.log(imageId)
        const userProfile = await pool.query("UPDATE users SET photo_id = $1,updated_at =$2 WHERE user_id =$3",[imageId,Date.now(),userId])
        res.status(200).json({
            success: true,
            message:"uploaded",
            data: userProfile
        })
    })
} 

const getUserProfileImage = async (req,res) => {
    const userId = req.user.id
    const profileImage = await pool.query("SELECT profile_image.image_url FROM profile_image LEFT JOIN users ON profile_image = users.photo_id WHERE users.user_id = $1",[userId])
    if(!profileImage.rows.length){
        return res.status(500).json("update failed")
    }
    return res.status(200).json({
        success: true,
        data:profileImage.rows[0]
    })
}
const displayModeToggle = async (req,res) => {
    const userId = req.user.id
    const toggleDisplay = await pool.query("SELECT user_id,user_name,user_first_name,last_name,image_url FROM users LEFT JOIN profile_image ON users.photo_id = profile_image.image_id WHERE user_id = $1 AND display_mode = TRUE",[userId])
    if(!toggleDisplay.rows.length){
        res.status()
    }
}


export default {
    createUser,
    getUser,
    uploadProfileImage,
    updateProfileName,
    getUserProfileImage
}