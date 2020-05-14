const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../db/config')

const Model = Sequelize.Model
class PullRequest extends Model {}
module.exports = PullRequest.init({
    owner: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
    },
    repo: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
    },
    number: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    },
    state: DataTypes.ENUM("open","closed"),
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    comments: DataTypes.INTEGER,
    commits: DataTypes.INTEGER,
    changed_files: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'PullRequest'
})