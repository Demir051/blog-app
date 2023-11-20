// Import required modules
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require('dotenv');
const sequelize = require("./data/db");
const locals = require("./middlewares/locals");
const cookieParse = require("cookie-parser");
const expressSession = require("express-session");
const SessionStore = require('express-session-sequelize')(expressSession.Store);

// Set up your Express application
app.set("view engine", "ejs");

// Import routes and models
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const Blog = require("./models/blog");
const Category = require("./models/category");
const User = require("./models/user");
const Role = require("./models/role")
const {
    truncate
} = require("fs");

// Define middlewares
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParse());
app.use(expressSession({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
        db: sequelize
    })
}));
app.use(locals);

// Define database relationships
Blog.belongsToMany(Category, {
    through: "BlogCategories"
});
Category.belongsToMany(Blog, {
    through: "BlogCategories"
});
Blog.belongsTo(User);
User.hasMany(Blog);

Role.belongsTo(User , {through : "userRoles"});
User.belongsToMany(Role , {through: "userRoles"})

// Serve static files and define routes
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);

// (async () => {
//     await sequelize.sync({force : true});
// })()

// Start the server listening
app.listen("3000", () => {
    console.log("Server to 3000 Port...");
});