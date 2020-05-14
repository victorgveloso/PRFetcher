const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../db/config')

const Model = Sequelize.Model
class Commit extends Model {}
Commit.init({
    owner: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        references: {
            model: 'PullRequests',
            key: 'owner'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    repo: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        references: {
            model: 'PullRequests',
            key: 'repo'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        references: {
            model: 'PullRequests',
            key: 'number'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    sha: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Commit'
})

module.exports = Commit