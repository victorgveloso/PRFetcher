const { Sequelize } = require('sequelize');
module.exports = new Sequelize('postgres','postgres','example', {
    host: 'localhost',
    dialect: 'postgres'
});