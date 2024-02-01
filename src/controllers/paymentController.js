import express from "express"
const router = express.Router()
import dotenv from "dotenv";
import Stripe from "stripe";
import { UnAuthorizedError } from "../errors/customError.js";
import pool from "../database/db.js";
import { authenticateUser } from "../middleware/authorization.js";
const stripe = Stripe(process.env.STRIPE)

//checkout route
router.get("/checkout",authenticateUser,(req,res) =>{
    try{
    res.status(201).json('cart')
    }catch(err){
        res.status(500).json(err)
    }
})
//payment route
router.post("/checkout",authenticateUser, async(req,res) =>{
    const userId = req.user.id;
    console.log("payment")
    const { cartId, token, user_address } = req.body;
    const totalPriceQuery = await pool.query('SELECT cart_total FROM cart WHERE id = $1', [cartId]);
    const totalPrice = totalPriceQuery.rows[0];
        stripe.charges.create({
            amount: totalPrice * 100, // Convert to cents
            currency: 'usd',
            payment_method: token,
            confirm: true,
        },async (stripeErr,stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            }else{
                const orderDate = Date.now()
                const {amount,payment_method,paid,status,id} = stripeRes
                await pool.query('INSERT INTO orders (user_id,order_date,total_amount,status,shiping_address,payment_status,payment_method,payment_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [userId,orderDate,amount,'processing',status,user_address,paid,payment_method,id]);
                res.status(200).json(stripeRes)
              }
         })
    }
)


 export {router}