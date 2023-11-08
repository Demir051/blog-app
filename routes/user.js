const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/blogs/category/:slug", userController.user_blogs);

router.get("/blogs/:slug", userController.user_blogDetails);

router.get("/blogs", userController.user_blogs);

router.get("/", userController.user_homepage);

module.exports = router;