import pool from "../database/db.js";
import { BadRequestError, NotFoundError } from "../errors/customError.js";


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
console.log("existingCartItem",existingCartItem.rows)
    if (existingCartItem.rows.length > 0) {
      // Update the quantity of the existing cart item
      console.log("existhere1")
      await pool.query(
        'UPDATE cart_item SET product_quantity = $1 WHERE cart_item_id = $2',
        [existingCartItem.rows[0].product_quantity + 1, existingCartItem.rows[0].cart_item_id]
      );
    } else {
      // Insert a new cart item
      console.log("existhere2")
      await pool.query(
        'INSERT INTO cart_item (cart_id, product_id, product_quantity) VALUES ($1, $2, $3)',
        [cartId, productId, 1]
      );
    }

    // Calculate and update cart totals here
    // Fetch all cart items for the specified cart
    const cartItems = await pool.query('SELECT * FROM cart_item WHERE cart_id = $1', [cartId]);

    let cartSubtotal = 0;
    console.log("existhere3")
    // Calculate subtotal and update each cart item's subtotal
    for (const cartItem of cartItems.rows) {
      // Fetch product price (you may need to join with the product table)
      const product = await pool.query('SELECT price FROM product WHERE product_id = $1', [cartItem.product_id]);
      const productPrice = product.rows[0].price;
      console.log("existhere4")
      const cartItemId = cartItem.cart_item_id
      console.log('cart_item_id',cartItemId)
      // Calculate item subtotal and update the cart_item record
      const subtotal = productPrice * cartItem.product_quantity;
      await pool.query('UPDATE cart SET cart_subtotal = $1 WHERE cart_id = $2', [subtotal, cartId]);

      // Add the item subtotal to the cart subtotal
      cartSubtotal += subtotal;
    }

    // You can apply discounts, tax, and shipping costs here if needed

    // Update the cart totals in the cart table
    const tax = 0; // Calculate tax if needed
    const shippingCost = 0; // C alculate shipping cost if needed
    const cartTotal = cartSubtotal + tax + shippingCost;
console.log("existhere5")
    const newCart = await pool.query(
      'UPDATE cart SET cart_subtotal = $1, cart_total = $2, cart_tax = $3, cart_shipping_cost = $4 WHERE cart_id = $5 RETURNING *',
      [cartSubtotal, cartTotal, tax, shippingCost, cartId]
    );
    // Return the updated cart information to the client
    res.json({ success: true, message: 'Item added to cart',data: newCart});
 
}


const getCart = async (req,res,next) => {
  const userId = req.user.id
  console.log("userId",userId)
  const cart = await pool.query("SELECT * FROM cart WHERE user_id = $1",[userId]);
  console.log("cart",cart)
  if (!cart.rows.length) return next(new NotFoundError("cart is empty"))
  res.status(200).json({data:cart.rows})
}


const deleteCart = async (req,res,next) => {
  const userId = req.user.id
  const {productId} = req.params
  const userCart = await pool.query("SELECT cart_id FROM cart WHERE user_id = $1",[userId])
  if(!userCart.rows.length) return next(new NotFoundError("user cart not found"))
  const {cart_id} = userCart.rows[0]
console.log("cartId",cart_id)
  const cartId = await pool.query("UPDATE cart_item SET product_quantity = product_quantity-1 WHERE product_id = $1 AND cart_id = $2 RETURNING *",[productId,cart_id])
  console.log("cartItem",cartId.rows[0])
  const product = await pool.query('SELECT price FROM product WHERE product_id = $1', [productId]);
  console.log("here")
  console.log("product",product.rows)
  const productPrice = product.rows[0].price; 
  // Calculate item subtotal and update the cart_item record
  console.log("price",productPrice)
  const subtotal = productPrice * cartId.rows[0].product_quantity;
  console.log("subtotal",subtotal)
  const cart = await pool.query('SELECT * FROM cart WHERE user_id = $1',[userId])
  const {cart_subtotal,cart_total} = cart
  if(cart_subtotal < 0) return next(new BadRequestError("Your cart is empty"))
  console.log("cart",cart.rows[0])
  const newCart = await pool.query('UPDATE cart SET cart_subtotal = $1 WHERE user_id = $2', [cart_subtotal-subtotal, userId]);

  // Add the item subtotal to the cart subtotal
  res.status(200).json({data:newCart.rows})
}



const cartTotal = async (req, res, next) => {
  const userId = req.user.id;
  const product = await pool.query('SELECT cart_item.product_id, cart_item.product_quantity, product.product_title, product.price,product.discount FROM cart LEFT JOIN cart_item ON cart.cart_id = cart_item.cart_id LEFT JOIN product ON cart_item.product_id = product.product_id WHERE user_id = $1', [userId]);
  
  const productRows = product.rows;
  let cartSubtotal = 0;

  for (const prod of productRows) {
    const { product_title, price, product_quantity, discount } = prod;

    // Convert discount to a number
    const discountValue = parseFloat(discount);

    if (isNaN(discountValue) || discountValue === null) {
      const subtotal = price * product_quantity;
      cartSubtotal += subtotal;
    } else {
      const subtotal = price * product_quantity * (discountValue * 0.01);
      cartSubtotal += subtotal;
    }
  }

  console.log(cartSubtotal);
  res.status(201).json({ data: cartSubtotal });
};


export default {
    addCart,
    getCart,
    deleteCart,
    cartTotal
}