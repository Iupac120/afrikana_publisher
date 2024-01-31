import express from "express"
const router = express.Router()
import Stripe from "stripe";
import { UnAuthorizedError } from "../errors/customError.js";
import pool from "../database/db.js";
import { authenticateUser } from "../middleware/authorization.js";
const stripe = Stripe(process.env.STRIPE)

//checkout route
// router.get("/checkout",authenticateUser,(req,res) =>{
//     try{
//     if(!req.session.cart){
//         throw new UnAuthorizedError("Access denied")
//     }
//     const cart = new Cart(req.session.cart)
//     res.status(201).json({total:cart.totalPrice})
//     }catch(err){
//         res.status(500).json(err)
//     }
// })
//payment route
router.post("/checkout",authenticateUser, async(req,res) =>{
    const userId = req.user.id;
    // if(!req.session.cart){
    //     throw new UnAuthorizedError("Access denied")
    // }
    const { cartId, token, user_address } = req.body;
    const totalPriceQuery = 'SELECT total_price FROM carts WHERE id = $1';
    const { rows } = await pool.query(totalPriceQuery, [cartId]);
    const totalPrice = rows[0].total_price;
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
                //  const order = new Order({
                //      user:req.user._id,//req.body.user
                //      cart:cart,//req.body.cart
                //      deliveryAddress:stripeRes.source.address_city,//req.body.address,//from the request body of the stripe
                //      name:stripeRes.source.name,//from the request body of the stripe
                //      isPaid:stripeRes.paid,
                //      totalPrice:stripeRes.amount,
                //      paidAt:Date.now(),
                //      paymentMethod:stripeRes.payment_method,
                //      paymentResult:{
                //          id:stripeRes.id,
                //          status:stripeRes.status,
                //          update_time:Date.now(),
                //          email_address:stripeRes.billing_details.email
                //      }
                //  })
                //  await order.save()
                //req.session.cart = null;
                res.status(200).json(stripeRes)
              }
         })
    }
)


 export {router}