const Blog = require("../models/blog");
const Category = require("../models/category");

const {Op} = require("sequelize");

const fs = require("fs");

const slugfield = require("../helpers/slugfield");

// Category Section

exports.admin_categories = async (req, res) => {

    try {

        const categories = await Category.findAll()

        res.render("admin/categories", {
            title: "Categories",
            categories: categories,
            actions: req.query.action,
            slug: req.query.slug,
        })
    } catch (err) {
        console.log(err);
    }

}

exports.admin_categoryEdit_get = async (req, res) => {

    const slug = req.params.slug

    try {

        const categories = await Category.findOne({
            where: {
                url:slug
            }
        })

        res.render("admin/category-edit", {

            title: categories.categoryName,
            categories: categories.dataValues

        });

    } catch (err) {
        console.log(err);
    }
}

exports.admin_categoryEdit_post = async (req, res) => {

    const slug = req.params.slug;

    const categoryName = req.body.name;

    try {

        const category = await Category.findOne({
            where:{
                url: slug 
            }
        });
        category.set({
            categoryName: categoryName,
            url: slugfield(categoryName) 
        })
        await category.save();

        res.redirect("/admin/categories?action=update&slug=" + slug);

    } catch (err) {
        console.log(err);
    }

}

exports.admin_categoryCreate_get = (req, res) => {

    try {

        res.render("admin/category-create", {
            title: "Category Create"
        })

    } catch (err) {

        console.log(err);

    }
}

exports.admin_categoryCreate_post = async (req, res) => {

    const category = req.body.categoryname;

    try {

        await Category.create({
            categoryName: category,
            url: slugfield(category)
        });
        res.redirect("/admin/categories?action=create");

        // const exist = await db.query("select name from categories where name = ?", [category]);

        // if (exist[0] == undefined && category !== null) {
        //     await db.query("insert into categories (name) values (?)", [category]);
        //     res.redirect("/admin/categories?action=create");
        // } else if (exist[0] !== undefined && category !== null) {
        //     res.redirect("/admin/categories?action=notcreate");
        // }

    } catch (err) {
        console.log(err);
    }

}

exports.admin_categoryDelete_get = async (req, res) => {

    const slug = req.params.slug;

    try {
        const categories = await Category.findOne({
            where: {
                url: slug
            }
        });

        res.render("admin/category-delete", {
            title: categories.categoryName,
            category: categories
        });

    } catch (err) {
        console.log(err)
    }
}

exports.admin_categoryDelete_post = async (req, res) => {
    const slug = req.body.slug;

    try {

        const category = await Category.findOne({
            where: {
                url: slug
            }
        });
        await category.destroy();
        res.redirect(`/admin/categories?action=delete&slug=${slug}`);

    } catch (err) {
        console.log(err);
    }
}

// Blog Section

exports.admin_blogs = async (req, res) => {

    try {

        const blogs = await Blog.findAll({
            attributes: ["id","title","image","url"],
            include: {
                model: Category,
                attributes: ["categoryName"]
            }
        });

        res.render("admin/blog-list", {
            title: "Admin Blogs",
            blogs: blogs,
            actions: req.query.action,
            slug: req.query.slug
        });

    } catch (err) {

        console.log(err);

    }
}

exports.admin_blogDelete_get = async (req, res) => {

    const slug = req.params.slug;

    try {   

        const blogs = await Blog.findOne({
            where: {
                url: slug
            }
        });

        res.render("admin/blog-delete", {
            title: blogs.title,
            blog: blogs
        })

    } catch (err) {
        console.log(err);
    }

}

exports.admin_blogDelete_post = async (req, res) => {

    const slug = req.body.slug;

    try {
        const blog = await Blog.findOne({
            where:{
                url:slug
            }
        });
        fs.unlink(`./public/images/${blog.image}`, err => console.log(err));
        await blog.destroy();

        res.redirect(`/admin/blogs?action=delete&slug=${slug}`);
    } catch (err) {
        console.log(err);
    }

}

exports.admin_blogEdit_get = async (req, res) => {
    const slug = req.params.slug;
    try {

        const blogs = await Blog.findOne({
            where: {
                url: slug
            },
            include:{
                model:Category,
                attributes:["id"]
            }
        });

        const categories = await Category.findAll();

        if (blogs) {
            res.render("admin/blog-edit", {
                title: blogs.title,
                blog: blogs,
                categories: categories
            });
        }

    } catch (err) {
        console.log(err);
    }
}

exports.admin_blogEdit_post = async (req, res) => {

    const slug = req.params.slug;
    const title = req.body.title;
    const secondtitle = req.body.secondtitle;
    const text = req.body.text;
    let image = req.body.image;
    const categoryIds = req.body.categories;
    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;

    if (req.file) {

        image = req.file.filename;
        

        fs.unlink(`./public/images/${req.body.image}`, err => console.log(err));
    }

    try {

        const blog = await Blog.findOne({
            where:{
                url: slug
            }
        });

        if(categoryIds == undefined || categoryIds == null || categoryIds == ""){
        
            await blog.setCategories([]);

        }else{
            
            await blog.setCategories([]);


            const selectCategories = await Category.findAll({
                where:{
                    id:{
                        [Op.in]: categoryIds
                    }
                }
            });

            await blog.addCategories(selectCategories);
        }

        blog.set({
            title: title,
            url: slugfield(title),
            secondTitle: secondtitle,
            body: text,
            image: image,
            confirm: confirm,
            homepage: homepage
        })
        await blog.save()
        res.redirect("/admin/blogs?action=update");

    } catch (err) {

        console.log(err);

    }
}

exports.admin_blogCreate_get = async (req, res) => {

    try {

        const categories = await Category.findAll();

        res.render("admin/blog-create", {
            title: "Admin Blog Create",
            categories: categories
        });

    } catch (err) {

        console.log(err);

    }
}

exports.admin_blogCreate_post = async (req, res) => {

    const title = req.body.title;
    const secondtitle = req.body.secondtitle;
    const text = req.body.text;
    const image = req.file.filename;
    const categoryIds = req.body.categories;
    const homepage = req.body.homepage == "on" ? 1 : 0;
    const confirm = req.body.confirm == "on" ? 1 : 0;

    try {
        const selectCategories = await Category.findAll({
            where: {
                id: {
                    [Op.in]: categoryIds
                }
            }
        });
        
        await Blog.create({
            title: title,
            url: slugfield(title),
            secondTitle: secondtitle,
            body: text,
            image: image,
            homepage: homepage,
            confirm: confirm
        }).then(blog => {
            blog.addCategories(selectCategories);
        });
    
        res.redirect("/admin/blogs?action=create");
    } catch (err) {
        console.log(err);
    }
}