
const addCart = async(req,res,next) =>{
    const express = require('express');
const pool = require('../db'); // Your database connection pool

const router = express.Router();
  const { productId} = req.params;
  const userId = req.user.id; // User's ID after authentication
    // Get the user's cart ID based on the user ID
    const userCart = await pool.query('SELECT cart_id FROM cart WHERE user_id = $1', [userId]);
    const cartId = userCart.rows[0].cart_id;

    // Check if the product already exists in the cart
    const existingCartItem = await pool.query(
      'SELECT * FROM cart_item WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existingCartItem.rows.length > 0) {
      // Update the quantity of the existing cart item
      await pool.query(
        'UPDATE cart_item SET product_quantity = $1 WHERE cart_item_id = $2',
        [existingCartItem.rows[0].product_quantity + 1, existingCartItem.rows[0].cart_item_id]
      );
    } else {
      // Insert a new cart item
      await pool.query(
        'INSERT INTO cart_item (cart_id, product_id, product_quantity) VALUES ($1, $2, $3)',
        [cartId, productId, 1]
      );
    }

    // Calculate and update cart totals here

    // Return the updated cart information to the client
    res.json({ success: true, message: 'Item added to cart' });

}