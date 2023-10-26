
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
    const art = await pool.query("SELECT sub_category.sub_category_name,product.product_title,product.exclusivity_status,product.price,product_description,dimension.dimension,dimension.unit FROM product LEFT JOIN sub_category ON product.product_id = sub_category.product_id LEFT JOIN dimension ON sub_category.sub_category_id = dimension.sub_category_id WHERE product.product_id = $1",[artworkId]);
    if(!art.rows.length) return next(new NotFoundError("Artwork not available"));
    res.status(200).json({data:art.rows})
}

const filterArtwork = async (req, res, next) => {
    const { catName, title, price, unit, dimension } = req.query;
    const obj = {};

    if (catName) {
        const catResults = await pool.query(
            "SELECT category.category_name, product.product_title, product.price FROM category " +
            "LEFT JOIN product ON category.category_id = product.category_id " +
            "WHERE category_name LIKE $1",
            [`%${catName}%`]
        );
        obj.catNameResults = catResults.rows;
    }

    if (title) {
        const titleResults = await pool.query(
            "SELECT product.product_title, product.price, product.product_description, artist.stage_name FROM artist " +
            "LEFT JOIN product ON artist.artist_id = product.artist_id " +
            "WHERE product_title LIKE $1",
            [`%${title}%`]
        );
        obj.titleResults = titleResults.rows;
    }

    if (price) {
        const priceResults = await pool.query(
            "SELECT product.product_title, product.price, product.product_description, artist.stage_name FROM artist " +
            "LEFT JOIN product ON artist.artist_id = product.artist_id " +
            "WHERE product.price BETWEEN 0 AND $1",
            [price]
        );
        obj.priceResults = priceResults.rows;
    }

    if (unit || dimension) {
        const dimensionResults = await pool.query(
            "SELECT product.product_title, product.price, product.product_description, artist.stage_name FROM artist " +
            "LEFT JOIN product ON artist.artist_id = product.artist_id " +
            "LEFT JOIN sub_category ON product.product_id = sub_category.product_id " +
            "LEFT JOIN dimension ON sub_category.sub_category_id = dimension.sub_category_id " +
            "WHERE dimension.dimension = $1 OR dimension.unit = $2",
            [unit, dimension]
        );
        obj.dimensionResults = dimensionResults.rows;
    }

    res.status(200).json({ data: obj });
}


const sortArtwork = async (req, res, next) => {
    const { price, popularity } = req.query;
    const obj = {};

    if (price) {
        const priceResults = await pool.query(
            "SELECT product.product_title, product.price, product.product_description, artist.stage_name " +
            "FROM artist " +
            "LEFT JOIN product ON artist.artist_id = product.artist_id " +
            "WHERE product.price BETWEEN 0 AND $1 " +
            "ORDER BY product.price",
            [price]
        );
        obj.priceResults = priceResults.rows;
    }

    if (popularity) {
        const popularityResults = await pool.query(
            "SELECT product.product_title, product.price, product.product_description, artist.stage_name " +
            "FROM artist " +
            "LEFT JOIN product ON artist.artist_id = product.artist_id " +
            "ORDER BY product.exclusivity_status"
        );
        obj.popularityResults = popularityResults.rows;
    }

    res.status(200).json({ data: obj });
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