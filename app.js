const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const Passport = require("passport");
const Session = require("express-session");


// Here it would be better if we put secret as env varaible like what we did for database credentials.
app.use(
  Session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(Passport.initialize());
app.use(Passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

Passport.serializeUser((user, done) => {
  done(null, user._id);
});

Passport.deserializeUser((id, done) => {
  done(null, { id });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "front/build")));
app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "./front/build", "index.html"));
});

module.exports = app;
