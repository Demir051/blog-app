const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth");


router.get("/register", authController.register_get);

router.post("/register", authController.register_post);

router.get("/login", authController.login_get);

router.post("/login", authController.login_post);

router.get("/reset-password", authController.reset_password_get);

router.post("/reset-password", authController.reset_password_post);

router.get("/new-password/:token", authController.new_password_get);

router.post("/new-password", authController.new_password_post);

router.get("/logout", authController.logout_get);

module.exports = router;