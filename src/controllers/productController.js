import { NotFoundError, UnAuthorizedError } from "../errors/customError.js";
import pool from "../database/db.js";


const createCategory = async(req,res,next) => {
    const userId =  req.user.id;
    const {catName} = req.body
    const isNameExist = await pool.query("SELECT category_name FROM category WHERE category_name = $1",[catName]);
    if(isNameExist.rows.length) return next(new UnAuthorizedError("Category name already exist"))
    const cat = await pool.query("INSERT INTO category (created_by,category_name) VALUES ($1,$2) RETURNING category_name",[userId,catName]);
    if(!cat.rows.length) return next(new NotFoundError("Failed to create category"))
    res.status(201).json({data:cat.rows[0]})
}

const createSubCategory = async(req,res,next) => {
    const {categoryId,name,qty,minStock,maxStock} = req.body
    const isNameExist = await pool.query("SELECT sub_category_name FROM sub_category WHERE sub_category_name = $1",[name]);
    if(isNameExist.rows.length) return next(new UnAuthorizedError("Category name already exist"))
    const subCat = await pool.query("INSERT INTO sub_category (category_id,sub_category_name,quantity_stock,minimum_stock,maximum_stock) VALUES ($1,$2,$3,$4,$5) RETURNING sub_category_name",[categoryId,name,qty,minStock,maxStock]);
    if(!subCat.rows.length) return next(new NotFoundError("Failed to create category"))
    res.status(201).json({data:subCat.rows[0]})
}

const createProduct = async (req,res,next) => {
    const {artistId,categoryId,title,desc,price,keywords} = req.body;
    const product = await pool.query("INSERT INTO product(artist_id,category_id,product_title,product_description,price,keywords) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[artistId,categoryId,title,desc,price,keywords]);
    if(!product.rows.length) return next(new NotFoundError("Failed to create product"));
    res.status(201).json({data:product.rows[0]})
}

export default {
    createCategory,
    createSubCategory,
    createProduct
}