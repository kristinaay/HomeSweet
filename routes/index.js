const express = require("express");
const router = express.Router();
const myDB = require("../db/myMongoDB.js");
const Passport = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-local").Strategy;
const authUtils = require("../utils/auth");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();

// app.use(cookieParser("cookie_secret"));

app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "home-session",
    keys: ["key1", "key2"],
  })
);
app.use(Passport.initialize());
app.use(Passport.session());
// app.use(Passport.initialize());
// app.use(Passport.session());

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

Passport.serializeUser((user, done) => {
  done(null, user._id);
});

Passport.deserializeUser((id, done) => {
  done(null, { id });
});

Passport.use(
  new GoogleStrategy(
    {
      clientID:
        "892822075789-7b9seutssna9gnlvb8jvf35jdbnmk9is.apps.googleusercontent.com",
      clientSecret: "C6M4OrcnErK5vqgS4PUHjnIS",

      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      });
    }
  )
);
Passport.use(
  new Strategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const client = new MongoClient(uri, { useUnifiedTopology: true });
      await client.connect();
      //database
      const db = await client.db("db2");
      const users = db.collection("users");

      users.findOne({ username }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }
        let newPass = authUtils.decrypt(user.password);
        if (password != newPass) {
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

router.post(
  "/signin1",
  Passport.authenticate("local", {
    failureRedirect: "/signin?error=Invalid username or password.",
  }),
  function (req, res) {
    res.redirect("/housing");
  }
);

router.post("/signup1", async (req, res, next) => {
  const registrationParams = req.body;

  const users = await myDB.initializeUsers();
  let user = req.body.username;

  if (
    registrationParams.password != registrationParams.password2 ||
    registrationParams.username == "" ||
    registrationParams.pasword == ""
  ) {
    res.redirect("/signup?error=Passwords must match.");
  } else {
    const payload = {
      username: registrationParams.username,
      password: authUtils.encrypt(registrationParams.password),
    };

    users.findOne(
      { username: registrationParams.username },
      function (err, user) {
        if (err) {
          return next(err);
        }
        if (user) {
          res.redirect("/signup?error=Username already exists.");
        } else {
          users.insertOne(payload, (err) => {
            if (err) {
              res.redirect("/signup?error=Error signing in.");
            }
          });
          res.redirect("/signin");
        }
      }
    );
  }
});

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

router.post(
  "/auth/google",
  Passport.authenticate("google", { scope: ["profile", "email"] })
);

router.post(
  "/auth/google/callback",
  Passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/housing");
  }
);

router.post("/failed", (req, res) =>
  res.send("signup/?error=Error signing in with Google.")
);

router.get("/getposts", async (req, res) => {
  console.log("getting posts 2");
  const posts = await myDB.getPosts();
  res.json(posts);
});

module.exports = router;
