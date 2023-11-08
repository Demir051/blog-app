const {DataTypes} = require("sequelize");

const sequelize = require("../data/db");

const Blog = sequelize.define("blog",{
    title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    secondTitle : {
        type: DataTypes.STRING,
        allowNull: true
    },
    body : {
        type: DataTypes.STRING,
        allowNull: false
    },
    image : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    homepage : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    confirm : {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    
}, {tableName: 'blog'},
   {timestamps: true}
)

module.exports = Blog;  