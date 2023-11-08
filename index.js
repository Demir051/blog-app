// Import required modules
const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./data/db");
const locals = require("./middlewares/locals");
const cookieParse = require("cookie-parser");
const expressSession = require("express-session");
const SessionStore = require('express-session-sequelize')(expressSession.Store);

// Set up your Express application
app.set("view engine", "ejs");

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

// Import routes and models
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const Blog = require("./models/blog");
const Category = require("./models/category");
const User = require("./models/user");
const { truncate } = require("fs");

// Define database relationships
Blog.belongsToMany(Category, {
    through: "BlogCategories"
});
Category.belongsToMany(Blog, {
    through: "BlogCategories"
});
Blog.belongsTo(User);
User.hasMany(Blog);

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