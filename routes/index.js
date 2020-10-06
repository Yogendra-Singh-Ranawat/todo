const { error } = require("console");

const express = require("express"),
    bodyParser = require("body-parser"),
    mysql = require("mysql"),
    path = require('path'),
    router = express.Router(),
    passport = require('passport'),
    dotenv = require('dotenv');

dotenv.config({ path: './.env' });

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/register", passport.authenticate('local-signup'), (req, res) => {
    console.log(req.body);
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate('local-login', {
    successRedirect: '/todos', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}), (req, res) => {
    console.log("hello");
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect("/");
});

module.exports = router;