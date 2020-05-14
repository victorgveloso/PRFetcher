const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../db/config')

const Model = Sequelize.Model
class File extends Model {}
File.init({
    owner: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'Commits',
            key: 'owner'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    repo: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'Commits',
            key: 'repo'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Commits',
            key: 'number'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    shaCommit: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'Commits',
            key: 'sha'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    sha: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    path: DataTypes.STRING
}, {
    sequelize,
    modelName: 'File'
})

module.exports = File