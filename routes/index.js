const { error } = require("console");

const express = require("express"),
    bodyParser = require("body-parser"),
    mysql = require("mysql"),
    path = require('path'),
    router = express.Router(),
    dotenv = require('dotenv');

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/register", (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    let query = 'SELECT email FROM users WHERE email=?';
    db.query(query, [email], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            console.log(email + ' already in use');
            return res.render('register');
        }
        else if (password !== passwordConfirm) {
            console.log('Password do not match ');
            return res.render('register');
        }
        let query1 = 'INSERT INTO users SET ?';
        db.query(query1, { name: name, email: email, password: password }, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(name + ', You had successfully registered');
                return res.render('landing');
            }
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login",
//         failureFlash: true
//     }), function (req, res) {
//     });

// router.get("/logout", function (req, res) {
//     req.logout();
//     req.flash("success", "Logged Out!!");
//     res.redirect("/");
// });

module.exports = router;