const Blog = require("../models/blog");
const Category = require("../models/category");

const {Op} = require("sequelize");

exports.user_homepage = async (req, res) => {
    if (req.url === "/") { // if bloğunu kullanmadığımda result 2 kere dönüyor
        const { page = 0 } = req.query;
        const size = 3;
        try {

            const {rows , count} = await Blog.findAndCountAll({
                where: {
                    confirm: {
                        [Op.eq]: true
                    },
                    homepage: {
                       [Op.eq]: true
                   }
                },
                limit: size,
                offset : page * size
            })

            const categories = await Category.findAll()

            res.render("users/index", {
                title: "Home Page",
                blogs: rows,
                currentPage: page,
                totalPages: Math.ceil(count / size),
                totalItems: count,
                categories: categories,
                selectedCategory: null,
            })

        } catch (err) {

            console.log(err);

        }
    }
}

exports.user_blogs = async (req, res) => {

    const size = 3;
    const {page = 0} = req.query;
    const slug = req.params.slug;

    try {

        const {rows , count} = await Blog.findAndCountAll({
            where: {
                confirm: {
                    [Op.eq]: true
                }
            },
            include: slug ? {model: Category , where:{ url : slug }} : null ,
            limit: size,
            offset: page * size
        });

        const categories = await Category.findAll();

        res.render("users/blogs", {
            title: "Blogs",
            blogs: rows,
            currentPage: page,
            totalPages: Math.ceil(count / size),
            totalItems: count,
            categories: categories,
            selectedCategory: slug
        })

    } catch (err) {

        console.log(err);

    }

}

exports.user_blogDetails = async (req, res) => {
    const slug = req.params.slug;
    try {
        // const blogFromId = await Blog.findByPk(id);
        const blogFromSlug = await Blog.findOne({
            where: {
                url: slug
            }
        });

        if (blogFromSlug) {
            return res.render("users/blog-details", {
                title: blogFromSlug.title,
                blogs: blogFromSlug
            });
        }
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
}
