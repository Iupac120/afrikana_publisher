
import pool from "../database/db.js"
import { NotFoundError } from "../errors/customError.js"


const getArtWorks = async (req,res,next) => {
    const art = await pool.query("SELECT sub_category.sub_category_name,sub_category.quantity_stock,category.category_name,product.product_title,product.price,product_description,artist.stage_name FROM sub_category LEFT JOIN category ON sub_category.category_id = category.category_id LEFT JOIN product ON category.category_id = product.category_id LEFT JOIN artist ON product.artist_id = artist.artist_id")
    if(!art.rows.length) return next(new NotFoundError("Art work not available"))
    res.status(200).json({data:art.rows})
}

const getSpecificArtWork = async (req,res,next) => {
    const {artworkId} = req.params
    const art = await pool.query("SELECT sub_category.sub_category_name,product.product_title,product.price,product_description,dimension.dimension,dimension.unit FROM product LEFT JOIN sub_category ON product.product_id = sub_category.product_id LEFT JOIN dimension ON sub_category.sub_category_id = dimension.sub_category_id WHERE product.product_id = $1",[artworkId]);
    if(!art.rows.length) return next(new NotFoundError("Art work not available"))
    res.status(200).json({data:art.rows})
}

const getCollection = async(req,res,next) => {
    const collection = await pool.query("SELECT category_name FROM category")
    if(!collection.rows.length) return next(new NotFoundError("Collection not available"))
    res.status(200).json({data:collection.rows})
}

const getSubCollection = async(req,res,next) => {
    const {colId} = req.params
    const subcol = await pool.query("SELECT sub_category_name FROM sub_category WHERE sub_category.category_id = $1",[colId])
    if(!subcol.rows.length) return next(new NotFoundError("Collection not available"))
    res.status(200).json({data:subcol.rows})
}

const getSpecificArtWorkDetails = async (req,res,next) => {
    const {artworkId} = req.params;
    const art = await pool.query("SELECT sub_category.sub_category_name,product.product_title,product.exclusivity_status,product.price,product_description,dimension.dimension,dimension.unit FROM product LEFT JOIN sub_category ON WHERE product.product_id = sub_category.product_id LEFT JOIN ON WHERE sub_category.sub_category_id = dimension.sub_category_id WHERE product.product_id = $1",[artworkId]);
    if(!art.rows.length) return next(new NotFoundError("Artwork not available"));
    res.status(200).json({data:art.rows})
}

const filterArtwork = async (req,res,next) => {
    const {catName,title,price,unit,dimension} = req.query;
    const obj = {};
    if(category){
        await pool.query("SELECT category.category_name, product.product_title, product.price FROM category LEFT JOIN product ON WHERE category.category_id = product.category_id WHERE category_name LIKE '%$1' IN category.category_name",[catName])
    }
    if(title){
        await pool.query("SELECT product.product_title, product.price,product.product_description, artist.stage_name FROM artist LEFT JOIN product ON WHERE artist.artist_id = product.artist_id WHERE product.product_title LIKE '%$1' IN product.product_title",[title])
    }
    if(price){
        await pool.query("SELECT product.product_title, product.price,product.product_description, artist.stage_name FROM artist LEFT JOIN product ON WHERE artist.artist_id = product.artist_id WHERE product.price BETWEEN 0 AND $1 IN product.price",[price])
    }
    if(unit || dimension){
        await pool.query("SELECT product.product_title, product.price,product.product_description, artist.stage_name FROM artist LEFT JOIN product ON WHERE artist.artist_id = product.artist_id LEFT JOIN sub_category ON WHERE product.product_id = sub_category.product_id LEFT JOIN ON dimension ON WHERE sub_category.sub_category_id = dimension.sub_category_id WHERE dimension.dimension = $1 OR dimension.unit",[unit,dimension])
    }
    res.status(200).json({data:obj})
}

const sortArtwork = async(req,res,next) => {
    const {price,popularity} = req.query
    const obj = {}
    if(price){
        await pool.query("SELECT product.product_title, product.price,product.product_description, artist.stage_name FROM artist LEFT JOIN product ON WHERE artist.artist_id = product.artist_id ORDER BY product.price BETWEEN 0 AND $1",[price])
    }
    if(popularity){
        await pool.query("SELECT product.product_title, product.price,product.product_description, artist.stage_name FROM artist LEFT JOIN product ON WHERE artist.artist_id = product.artist_id ORDER BY product.exclusivity_status")
    }
    res.status(200).json({data:obj})
}

export default {
    getArtWorks,
    getSpecificArtWork,
    getCollection,
    getSubCollection,
    getSpecificArtWorkDetails,
    filterArtwork,
    sortArtwork
}