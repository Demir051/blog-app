const {DataTypes} = require("sequelize");

const sequelize = require("../data/db");

const Category = sequelize.define("category", {
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {tableName: 'category'})

module.exports = Category;