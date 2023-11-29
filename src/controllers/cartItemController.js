import pool from "../database/db.js";
import { NotFoundError } from "../errors/customError.js";


const addCart = async (req,res,next) =>{
  const { productId} = req.params;
  const userId = req.user.id; // User's ID after authentication
  //create cart if does not exist
  await pool.query("INSERT INTO cart (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",[userId])
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
    // Fetch all cart items for the specified cart
    const cartItems = await pool.query('SELECT * FROM cart_item WHERE cart_id = $1', [cartId]);

    let cartSubtotal = 0;

    // Calculate subtotal and update each cart item's subtotal
    for (const cartItem of cartItems.rows) {
      // Fetch product price (you may need to join with the product table)
      const product = await pool.query('SELECT price FROM product WHERE product_id = $1', [cartItem.product_id]);
      const productPrice = product.rows[0].price;

      // Calculate item subtotal and update the cart_item record
      const subtotal = productPrice * cartItem.product_quantity;
      await pool.query('UPDATE cart SET cart_subtotal = $1 WHERE cart_item_id = $2', [subtotal, cartItem.cart_item_id]);

      // Add the item subtotal to the cart subtotal
      cartSubtotal += subtotal;
    }

    // You can apply discounts, tax, and shipping costs here if needed

    // Update the cart totals in the cart table
    const tax = 0; // Calculate tax if needed
    const shippingCost = 0; // C alculate shipping cost if needed
    const cartTotal = cartSubtotal + tax + shippingCost;

    await pool.query(
      'UPDATE cart SET cart_subtotal = $1, cart_total = $2, cart_tax = $3, cart_shipping_cost = $4 WHERE cart_id = $5',
      [cartSubtotal, cartTotal, tax, shippingCost, cartId]
    );
    // Return the updated cart information to the client
    res.json({ success: true, message: 'Item added to cart' });

}

const getCart = async (req,res,next) => {
  const userId = req.user.id
  const cart = await pool.query("SELECT FROM cart WHERE user_id = $1",[userId]);
  if (!cart.length){
    return res.json("Your cart is empty")
  } 
  res.staus(200).json({data:cart.rows})
}

const updateCart = async(req,res,next) => {
  const userId = req.user.id
  const userCart = await pool.query('SELECT cart_id FROM cart WHERE user_id = $1', [userId]);
    const cartId = userCart.rows[0].cart_id;

    // Check if the product already exists in the cart
    const existingCartItem = await pool.query(
      'SELECT * FROM cart_item WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );
      // Update the quantity of the existing cart item
      await pool.query(
        'UPDATE cart_item SET product_quantity = $1 WHERE cart_item_id = $2',
        [existingCartItem.rows[0].product_quantity + 1, existingCartItem.rows[0].cart_item_id]
      );
    // Calculate and update cart totals here
    // Fetch all cart items for the specified cart
    const cartItems = await pool.query('SELECT * FROM cart_item WHERE cart_id = $1', [cartId]);

    let cartSubtotal = 0;

    // Calculate subtotal and update each cart item's subtotal
    for (const cartItem of cartItems.rows) {
      // Fetch product price (you may need to join with the product table)
      const product = await pool.query('SELECT price FROM product WHERE product_id = $1', [cartItem.product_id]);
      const productPrice = product.rows[0].price;

      // Calculate item subtotal and update the cart_item record
      const subtotal = productPrice * cartItem.product_quantity;
      await pool.query('UPDATE cart SET cart_subtotal = $1 WHERE cart_item_id = $2', [subtotal, cartItem.cart_item_id]);

      // Add the item subtotal to the cart subtotal
      cartSubtotal += subtotal;
    }

    // You can apply discounts, tax, and shipping costs here if needed

    // Update the cart totals in the cart table
    const tax = 0; // Calculate tax if needed
    const shippingCost = 0; // C alculate shipping cost if needed
    const cartTotal = cartSubtotal + tax + shippingCost;

    await pool.query(
      'UPDATE cart SET cart_subtotal = $1, cart_total = $2, cart_tax = $3, cart_shipping_cost = $4 WHERE cart_id = $5',
      [cartSubtotal, cartTotal, tax, shippingCost, cartId]
    );
    // Return the updated cart information to the client
    res.json({ success: true, message: 'Item added to cart' });

}

const deleteCart = async (req,res,next) => {
  const userId = req.user.id
  const {productId} = req.params
  const userCart = await pool.query("SELECT FROM cart WHERE user_id = $1",[userId])
  if(!userCart.rows.length) return next(new NotFoundError("user cart not found"))
  const cartId = await pool.query("DELETE FROM cart_item WHERE product_id = $1",[productId])
  const product = await pool.query('SELECT price FROM product WHERE product_id = $1', [cartItem.product_id]);
  const productPrice = product.rows[0].price;

  // Calculate item subtotal and update the cart_item record
  const subtotal = productPrice * cartItem.product_quantity;
  await pool.query('UPDATE cart SET cart_subtotal = $1 WHERE cart_item_id = $2', [subtotal, cartItem.cart_item_id]);

  // Add the item subtotal to the cart subtotal
  cartSubtotal += subtotal
}
export default {
    addCart,
    getCart,
    updateCart,
    deleteCart
}