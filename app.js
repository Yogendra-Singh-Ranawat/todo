const express = require("express"),
  bodyParser = require("body-parser"),
  mysql = require("mysql"),
  path = require('path'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  dotenv = require('dotenv');

const indexRoute = require('./routes/index'),
  todosRoute = require('./routes/todos');

const publicDirectory = path.join(__dirname, './public');
dotenv.config({ path: './.env' })
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("express-session")({
  secret: "Once again I am Beginner!!! ",
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(publicDirectory));

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.userid);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  db.query("select * from users where userid = " + id, function (err, rows) {
    done(err, rows[0]);
  });
});

global.db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});
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
// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
},
  function (req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    db.query("select * from users where email = '" + email + "'", function (err, rows) {
      console.log(rows);
      console.log("above row object");
      if (err)
        return done(err);
      if (rows.length) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {

        // if there is no user with that email
        // create the user
        var newUserMysql = new Object();
        newUserMysql.email = email;
        newUserMysql.password = password; // use the generateHash function in our user model

        var insertQuery = "INSERT INTO users ( email, password ) values ('" + email + "','" + password + "')";
        console.log(insertQuery);
        db.query(insertQuery, function (err, rows) {
          console.log(rows);
          newUserMysql.id = rows.userid;
          return done(null, newUserMysql);
        });
      }
    });
  }));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
},
  function (req, email, password, done) { // callback with email and password from our form

    db.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function (err, rows) {
      if (err)
        return done(err);
      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if (!(rows[0].password == password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      req.session.user = rows[0];
      // all is well, return successful user
      return done(null, rows[0]);

    });



  }));

//=====================
//landing page
//=====================
app.use('/', indexRoute);
app.use('/todos', todosRoute);


app.listen(3200, () => {
  console.log("Connected to the server on port 3200!!... enjoy coding..");
}); 
