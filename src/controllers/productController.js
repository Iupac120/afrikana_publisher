import { NotFoundError } from "../errors/customError.js";
import pool from "../database/db.js";


const createCategory = async(req,res) => {
    const userId =  req.user.id;
    const {catName} = req.body
    const cat = await pool.query("INSERT INTO category (created_by,category_name) VALUES ($1,$2) RETURNING category_name",[userId,catName]);
    if(!cat.rows.length) return next(new NotFoundError("Failed to create category"))
    res.status(201).json({data:cat.rows[0]})
}

const createProduct = async (req,res) => {
    const {product_title,product_description,price,keywords} = req.body;
    const product = await pool.query("INSERT INTO product(artist_id,category_id,product_title,product_description,price,keywords) VALUES ($1,")
}

export default {
    createCategory
}