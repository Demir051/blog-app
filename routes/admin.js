const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/image-upload");

const adminController = require("../controllers/admin");

const isAuth = require('../middlewares/auth');

// Blog Section

router.get("/blog/create", isAuth, adminController.admin_blogCreate_get);

router.post("/blog/create", isAuth, imageUpload.upload.single("image"), adminController.admin_blogCreate_post);

router.get("/blog/:slug", isAuth, adminController.admin_blogEdit_get);

router.post("/blog/:slug", isAuth, imageUpload.upload.single("image"), adminController.admin_blogEdit_post);

router.get("/blog/delete/:slug", isAuth, adminController.admin_blogDelete_get);

router.post("/blog/delete/:slug", isAuth, adminController.admin_blogDelete_post);

router.get("/blogs", isAuth, adminController.admin_blogs);

// Category Section

router.get("/category/delete/:slug", isAuth, adminController.admin_categoryDelete_get);

router.post("/category/delete/:slug", isAuth, adminController.admin_categoryDelete_post);

router.get("/category/create", isAuth, adminController.admin_categoryCreate_get);

router.post("/category/create", isAuth, adminController.admin_categoryCreate_post);

router.get("/category/:slug", isAuth, adminController.admin_categoryEdit_get);

router.post("/category/:slug", isAuth, adminController.admin_categoryEdit_post);

router.get("/categories", isAuth, adminController.admin_categories);

module.exports = router;