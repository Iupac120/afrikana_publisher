import express, { query } from "express";
import bcrypt from "bcrypt";
import pool from "../database/db.js"
import cloudinary from "../utils/cloudinary.js";
import { NotFoundError, UnAuthorizedError } from "../errors/customError.js";

const getUser = async (req,res) => {
    try {
        const users = await pool.query("SELECT * FROM users")
        res.staus(200).json({users:users.rows})
    } catch (error) {
        res.staus(500).json(error.message)
    }
}



//profile creation

const createProfileName = async (req,res) => {
    const {firstName, lastName} = req.body
    const userId = req.user.id
    console.log("userId",req.user.id)
   const names = await pool.query("INSERT INTO user_profiles (user_id,first_name,last_name) VALUES($1,$2,$3) RETURNING first_name,last_name",[userId,firstName,lastName])
   if(!names.rows.length){
    return res.status(500).json("Failed to update")
   }
    res.status(201).json({sucees: true, data:names.rows[0]})
}


const updateProfileName = async (req,res) => {
    const {firstName, lastName} = req.body
    const userId = req.user.id
    console.log("userId",req.user.id)
   const names = await pool.query("UPDATE user_profiles SET first_name = $1,last_name =$2 WHERE user_id = $3 RETURNING first_name,last_name",[firstName,lastName,userId])
   if(!names.rows.length){
    return res.status(500).json("Failed to update")
   }
    res.status(201).json({sucees: true, data:names.rows[0]})
}


const uploadProfileImage = async (req,res) => {
    //const {image} = req.body
    const userId = req.user.id //authorization middleware
    console.log("path",req.file.path)
    console.log("userId",req.user.id)
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
        //const public_id = result.public_id
        console.log("result",result)
        const image_url = result.url
        console.log("datatype",typeof(image_url))
        const imageId = await pool.query("UPDATE user_profiles SET avatar_url = $1 WHERE user_id = $2 RETURNING avatar_url",[image_url,userId])
        console.log(imageId.rows[0])
        //const userProfile = await pool.query("SELECT image_url FROM profile_image WHERE user_id =$1",[userId])
        res.status(200).json({
            success: true,
            message:"uploaded",
            data: imageId.rows[0]
        })
    })
} 

const getUserProfileImage = async (req,res) => {
    const userId = req.user.id
    const profileImage = await pool.query("SELECT avatar_url FROM user_profiles WHERE user_id = $1",[userId])
    if(!profileImage.rows.length){
        return res.status(500).json("Failed to get user image")
    }
    return res.status(200).json({
        success: true,
        data:profileImage.rows[0]
    })
}
const displayModeToggle = async (req,res) => {
    const {display} = req.query
    const userId = req.user.id
    if(display){
        const toggleDisplay = await pool.query("SELECT users.user_name,avatar_url FROM users LEFT JOIN user_profiles ON users.user_id = user_profiles.user_id WHERE user.user_id = $1",[userId])
         res.status(201).json({
        success: true,
        data:toggleDisplay.rows[0]
    })
    }else {
        const toggleDisplay= await pool.query("SELECT user_name FROM users WHERE user_id = $1",[userId])
        res.status(201).json({
            success: true,
            data:toggleDisplay.rows[0]
        })
    }
   
}


//account setting
const updateUserPassword = async (req,res) => {
    const userId = req.user.id
    const userPass = await pool.query("SELECT user_password,user_name FROM users WHERE user_id = $1",[userId])
    if(!userPass.rows.length) return res.status(500).json("Failed to get user pass")
    const userPassNo = userPass.rows[0]
    const {password, newPassword} = req.body
    const isMatch = await bcrypt.compare(password,userPassNo)
    if(!isMatch) return res.status(500).json("Password does not match")
    const hashedPassword = await bcrypt.hash(newPassword,10)
    const updateUserPass = await query.pool("UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING user_name",[hashedPassword,userId])
    if(!updateUserPass.rows.length) return res.status(500).json("Failed to update user")
    return res.status(200).json("User updated successfully")
}


const updateUserEmail = async (req,res) => {
    const userId = req.user.id
    const userEmail = await pool.query("SELECT user_email FROM users WHERE user_id = $1",[userId])
    if(!userEmail.rows.length) return res.status(500).json("Failed to get user pass")
    const userEmailNo = userPass.rows[0]
    const {newEmail} = req.body
    const isMatch = await bcrypt.compare(newEmail,userEmailNo)
    if(!isMatch) return res.status(500).json("Email does not match")
    const updateUserPass = await query.pool("UPDATE users SET user_email = $1, updated_at = $2 WHERE user_id = $3",[newEmail,Date.now(),userId])
    if(!updateUserPass.rows.length) return res.status(500).json("Failed to update user")
    return res.status(200).json("User updated successfully")
}
//digital market place
const createArtist = async (req,res,next) => {
    const userId = req.user.id;
    const {name,bio,socialLink} = req.body;
    const artistExist = await pool.query("SELECT user_id FROM artist WHERE user_id = $1",[userId]);
    if(artistExist.rows.length) return next(new UnAuthorizedError("You have alreaDy created an artist account"))
    const artist = await pool.query("INSERT INTO artist (user_id,bio,social_media_links,stage_name) VALUES ($1,$2,$3,$4) RETURNING stage_name",[userId,bio,socialLink,name]);
    if(!artist.rows.length) return next(new NotFoundError("Failed to create artist"))
    const newArtist = await pool.query("SELECT artist.stage_name,artist.bio,artist.social_media_links,user_profiles.avatar_url FROM artist JOIN user_profiles ON artist.user_id = user_profiles.user_id WHERE artist.user_id = $1",[userId])
    if(!newArtist.rows.length) return next(new NotFoundError("Failed to get artist profile"))
    res.status(201).json({
    success: true,
    data: newArtist.rows[0]    
    })
}

// vendor account
 const createVendorAccount = async (req,res) => {
    const userId = req.user.id;
    const {accName,accNo,bank} = req.body;
    const vendorAcc = await pool.query("INSERT INTO vendor_account (user_id,account_name,account_number,bank) VALUES ($1,$2,$3,$4) RETURNING account_name",[userId,accName,accNo,bank]);
    if(!vendorAcc.rows.length) return next(new NotFoundError("Failed to create vendor account"))
    res.status(201).json({data:vendorAcc.rows[0]}) 
 }


//artist dashboard
const createEarning = async (req,res) => {
    const userId = req.user.id;
    const {amount} = req.body
    const earnDate = Date.now()
    const earn = await pool.query("INSERT INTO user_earning (earning_amount,earning_date) VALUES ($1,$2) WHERE user_id = $3 RETURNING )*",[amount,earnDate,userId])
    if(!earn.rows.length) return res.status(500).json("Failed to add earning")
    res.status(201).json({
        success: true,
        data: earn
    })
}

const getEarning = async (req,res) => {
    const userId = req.body.id
    const earns = await pool.query("SELECT * FROM user_earning WHERE user_id = $1",[userId])
    if(!earns.rows.length) return res.status(500).json("There is no earning")
    res.status(200).json({data: earns})
}

const createAnalytics = async (req,res) => {
    const userId = req.user.id;
    const {amount} = req.body
    const earnDate = Date.now()
    const earn = await pool.query("INSERT INTO user_earning (earning_amount,earning_date) VALUES ($1,$2) WHERE user_id = $3 RETURNING )*",[amount,earnDate,userId])
    if(!earn.rows.length) return res.status(500).json("Failed to add earning")
    res.status(201).json({
        success: true,
        data: earn
    })
}

const getAnalytics = async (req,res) => {
    const userId = req.body.id
    const earns = await pool.query("SELECT * FROM user_earning WHERE user_id = $1",[userId])
    if(!earns.rows.length) return res.status(500).json("There is no earning")
    res.status(200).json({data: earns})
}


export default {
    getUser,
    createProfileName,
    uploadProfileImage,
    updateProfileName,
    getUserProfileImage,
    displayModeToggle,
    updateUserPassword,
    updateUserEmail,
    createArtist,
    createVendorAccount,
    createEarning,
    getEarning
}