const express = require("express"),
  bodyParser = require("body-parser"),
  mysql = require("mysql"),
  path = require('path'),
  dotenv = require('dotenv');

dotenv.config({ path: './.env' })
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
//=======================================================
//Database Create Connection
//=======================================================
var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

//=======================================================
//Database Connected
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
app.use('/', require('./routes/index'));

app.get("/todos", (req, res) => {
  res.render("todos");
});


app.listen(3000, () => {
  console.log("Connected to the server on port 3000!!... enjoy coding..");
}); 
