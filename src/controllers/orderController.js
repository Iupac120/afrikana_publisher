import pool from "../database/db.js";
import { NotFoundError } from "../errors/customError.js";

const getOrder = async (req,res) => {
    const userId = req.user.id
    const order = await pool.query("SELECT * FROM orders WHERE user_id = $1",[userId])
    if(!order.length.row) return next(new NotFoundError("Orders not found"))
    res.status(200).json({"data":order.rows})
}


export default{getOrder}