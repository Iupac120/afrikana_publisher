import pg from "pg";
const {Pool} = pg

let localConfigPool = {
    user: process.env.pgUSER,
    password:process.env.pgPASSWORD,
    host:process.env.pgHOST,
    port:process.env.pgPORT,
    database:process.env.DATABASE
}

let poolConfig = process.env.DATABASE_URL? {connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized: false}}: localConfigPool

const pool = new Pool(poolConfig)

export default pool