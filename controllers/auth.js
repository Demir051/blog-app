const User = require("../models/user");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const {
    Op
} = require('sequelize');

const emailService = require("../helpers/send-mail");
const config = require("../config");


exports.register_get = async (req, res) => {
    try {
        return res.render("auth/register", {
            title: "Register"
        })
    } catch (err) {
        console.log(err);
    }
}

exports.register_post = async (req, res) => {

    const {
        userName,
        email,
        password
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    try {

        if (!(userName && email && password)) {
            return res.render("auth/register", {
                title: "Register",
                message: "Please fill all fields",
                alert: "danger"
            })
        }

        const match = await User.findAll({
            where: {
                [Op.or]: [{
                        email: email
                    },
                    {
                        userName: userName
                    }
                ]
            }
        });


        if (match.length === 0) {

            const newUser = await User.create({
                userName: userName,
                email: email,
                password: hashPassword,
            });

            emailService.sendMail({
                from: config.email.from,
                to: newUser.email,
                subject: "Welcome to my blog",
                text: "Your account has been created successfully"
            });
            

            return res.redirect("login");

        }

        return res.render("auth/register", {
            title: "Register",
            message: "User already exist",
            alert: "danger"
        })
    } catch (err) {
        console.log(err);
    }
}

exports.login_get = async (req, res) => {
    
    const emailMessage = req.session.emailMessage || {message: "Default message",alert: "Default alert"};
    delete req.session.emailMessage;
    
    try {
        return res.render("auth/login", {
            title: "Login",
            message: emailMessage.message ,
            alert: emailMessage.alert 
        })
    } catch (err) {
        console.log(err);
    }
}

exports.login_post = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        if (!(email && password)) {
            return res.render("auth/login", {
                title: "Login",
                message: "Please fill all fields",
                alert: "danger"
            })
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.render("auth/login", {
                title: "Login",
                message: "Email is wrong",
                alert: "danger"
            });
        }


        const match = await bcrypt.compare(password, user.password);


        if (match) {
            // res.cookie("isAuth", 1);
            req.session.isAuth = true;
            req.session.fullName = user.userName;
            const url = req.query.returnUrl || "/";
            return res.redirect(url);
        }

        return res.render("auth/login", {
            title: "Login",
            message: "Password is wrong",
            alert: "danger"
        })


    } catch (err) {
        console.log(err);
    }
}

exports.reset_password_get = async (req, res) => {
    const emailMessage = req.session.emailMessage || {message: "Default message",alert: "Default alert"};
    delete req.session.emailMessage;
    try {
        return res.render("auth/reset-password", {
            title: "Reset Password",
            message: emailMessage.message ,
            alert: emailMessage.alert
        })
    } catch (err) {
        console.log(err);
    }
}

exports.reset_password_post = async (req, res) => {
    const email = req.body.email;
    try {
        var token = crypto.randomBytes(32).toString('hex');
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            req.session.emailMessage = {message : "Email is wrong", alert : "danger"};
            return res.redirect("reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: email,
            subject: "Reset Password",
            html: `<p>Click 
            <a href="http://localhost:3000/account/reset-password/${token}">here</a> 
            to reset your password</p>`
        });

        req.session.emailMessage = {message : "Email sent successfully", alert : "success"};
        res.redirect("login");



    } catch (err) {
        console.log(err);
    }
}

exports.new_password_get = async (req, res) => {
    
    const token = req.params.token;
    
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        });
        return res.render("auth/new-password", {
            title: "Reset Password",
            token: token ,
            userId : user.id
        })
    } catch (err) {
        console.log(err);
    }
}

exports.new_password_post = async (req, res) => {
    const token = req.body.token;
    const userId = req.body.userId;
    const newPassword = req.body.password;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            },
            id: userId
        });
        
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        return res.render("auth/new-password", {
            title: "Reset Password",
            token: token
        })
    } catch (err) {
        console.log(err);
    }
}

exports.logout_get = async (req, res) => {
    try {
        if (req.session) {
            await new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        return res.redirect("/account/login");
    } catch (err) {
        console.log(err);
    }
}