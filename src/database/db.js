import pg from "pg";
const {Pool} = pg

let localConfigPool = {
    user: process.env.USER,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port:process.env.PORT,
    database:process.env.DATABASE
}

let poolConfig = process.env.DATABASE_URL? {connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized: false}}: localConfigPool

const pool = new Pool(poolConfig)

export default pool