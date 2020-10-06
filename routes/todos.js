const { error } = require("console");

const express = require("express"),
    mysql = require("mysql"),
    router = express.Router(),
    dotenv = require('dotenv');

dotenv.config({ path: './.env' })

router.get("/", (req, res) => {
    let query = 'SELECT * FROM todos where userid = ?';
    console.log(req.body);
    db.query(query, req.user.id, (error, results) => {
        res.render("todos", { todos: results });
    });
});

router.post("/", (req, res) => {
    let query = 'INSERT INTO todos SET ? ';
    let todo = { userid: 1, task: req.body.task };
    db.query(query, todo, (error, result) => {
        if (error) {
            console.log(error);
        }
        else
            res.redirect('/todos');
    });
});

router.get("/new", (req, res) => {
    res.render("new");
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (!foundCampground) {
            req.flash("error", "Campground not found.");
            return res.redirect("back");
        }
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err)
            res.redirect("/campgrounds");
        else {
            req.flash("success", "Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY todo route
router.delete("/:id", (req, res) => {
    let query = 'DELETE FROM todos WHERE taskid=?';
    console.log(req.params.id);
    db.query(query, [req.params.id], (err) => {
        if (err) {
            req.flash("error", "Error Occured..");
            res.redirect("/todos");
        }
        else {
            req.flash("success", "todo Deleted !!");
            res.redirect("/todos");
        }
    });
});


module.exports = router;