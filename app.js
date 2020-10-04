const express = require("express"),
  bodyParser = require("body-parser"),
  mysql = require("mysql");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//=======================================================
//Database Create Connection
//=======================================================
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: "3306",
  password: "qaz1wsx2edc3",
  database: "todoapp",
});

//=======================================================
//Database onnected
//=======================================================

db.connect((err) => {
  if (err) {
    console.error(
      "================== \n error connecting:    \n" +
      err.stack +
      "\n\n ===================== \n"
    );
    return;
  }
  console.log("MySql database connected... ");
});

//=====================
//landing page
//=====================
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/todos", (req, res) => {
  res.render("todos");
});

app.listen(3000, () => {
  console.log("Connected to the server on port 3000!!... enjoy coding..");
});
