const {
    Client
} = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'example',
    port: 5432,
})
module.exports = client