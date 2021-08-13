const {
    Client
} = require('pg')
const client = new Client({
    user: process.env.DB_USER,
    host:  process.env.DB_HOST,
    database: process.env.DB_NAME || "github",
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
})
module.exports = client