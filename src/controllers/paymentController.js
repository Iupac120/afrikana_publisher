import express from "express"
const router = express.Router()
import Stripe from "stripe";
import { UnAuthorizedError } from "../errors/error.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const stripe = Stripe(process.env.STRIPE)

//checkout route
router.get("/checkout",authenticateUser,(req,res) =>{
    try{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
    res.status(201).json({total:cart.totalPrice})
    }catch(err){
        res.status(500).json(err)
    }
})
//payment route
router.post("/checkout",authenticateUser,(req,res) =>{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
        stripe.charges.create({
            source: req.body.tokenId,
            amount:req.body.amount,//cart.totalPrice*100,//req.body.amount
            currency:'USD'
        },async (stripeErr,stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            }else{
                 const order = new Order({
                     user:req.user._id,//req.body.user
                     cart:cart,//req.body.cart
                     deliveryAddress:stripeRes.source.address_city,//req.body.address,//from the request body of the stripe
                     name:stripeRes.source.name,//from the request body of the stripe
                     isPaid:stripeRes.paid,
                     totalPrice:stripeRes.amount,
                     paidAt:Date.now(),
                     paymentMethod:stripeRes.payment_method,
                     paymentResult:{
                         id:stripeRes.id,
                         status:stripeRes.status,
                         update_time:Date.now(),
                         email_address:stripeRes.billing_details.email
                     }
                 })
                 await order.save()
                req.session.cart = null;
                res.status(200).json(stripeRes)
              }
         })
    }
)

 export {router}