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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser("cookie_secret"));
app.use(
  Session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(Passport.initialize());
app.use(Passport.session());

app.use(cookieParser("cookie_secret"));

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

Passport.serializeUser((user, done) => {
  done(null, user._id);
});

Passport.deserializeUser((id, done) => {
  done(null, { id });
});

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
    res.redirect("/housing?username=" + req.user.username);
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
    res.send(true);
  } else {
    res.send(false);
  }
};

router.post("/failed", (req, res) =>
  res.send("signup/?error=Error signing in with Google.")
);

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

router.get("/getlog", async (req, res) => {
  if (req.isAuthenticated()) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get("/getposts", async (req, res) => {
  const posts = await myDB.getPosts();
  res.json(posts);
});

router.post("/getevents", async (req, res) => {
  const events = await myDB.getEvents(req.body.username);
  res.json(events);
});

router.post("/getsavedposts", async (req, res) => {
  const rtn = await myDB.getSaved(req.body.username);
  res.json(rtn);
});

router.post("/savehousing", async (req, res) => {
  const info = req.body;
  await myDB.addSavedToDB(
    info.username,
    info.title,
    info.price,
    info.housinginfo,
    info.hood,
    info.date,
    info.body,
    info.address,
    info.images
  );
  return res.json();
});

router.post("/deletehousing", async (req, res) => {
  await myDB.deleteSavedFromDB(req.body.username, req.body.title);
  return res.json();
});

router.post("/updatehousing", async (req, res) => {
  const info = req.body;
  await myDB.updateSavedInDB(
    info.username,
    info.title,
    info.price,
    info.housinginfo,
    info.hood,
    info.date,
    info.body,
    info.address,
    info.images,
    info.notes
  );
  return res.json();
});
router.post("/senddata", async (req, res) => {
  const info = req.body;
  const data = await myDB.addToDB(
    info.username,
    info.title,
    info.start,
    info.end,
    info.allDay
  );
  res.json(data);
});

router.post("/senddata2", async (req, res) => {
  const info = req.body;
  const data = await myDB.addToDB(
    info.username,
    info.title,
    info.startdate,
    info.enddate,
    false
  );
  res.redirect("/appointments");
});

router.post("/deletedata", async (req, res) => {
  const info = req.body;

  const data = await myDB.deleteFromDB(
    info.username,
    info.title,
    info.start,
    info.end,
    info.allDay
  );
  res.json(data);
});

router.post("/deletedata2", async (req, res) => {
  const info = req.body;

  const data = await myDB.deleteFromDB(
    info.username,
    info.title,
    info.start,
    info.end,
    false
  );
  res.redirect("/appointments");
});

router.post("/signout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/deleteacc", async (req, res, next) => {
  const users = await myDB.initializeUsers();
  const info = req.body;

  users.findOne({ username: info.confirmusername }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect("/account?error=User not found, please try again.");
    } else {
      users.deleteOne({
        username: info.confirmusername,
      });
      res.redirect("/?msg=Account was successfully deleted.");
    }
  });
});

router.post("/updateuser", async (req, res, next) => {
  const users = await myDB.initializeUsers();
  const info = req.body;
  users.findOne({ username: info.newusername }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      res.redirect("/account?error=Username already exists.");
    } else {
      users.findOne({ username: info.username }, function (err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.redirect("/account?error=User not found, please try again.");
        } else {
          users.updateOne(
            {
              username: info.username,
            },
            {
              $set: {
                username: info.newusername,
              },
            }
          );

          res.redirect("/account?msg=Profile updated successfully.");
        }
      });
    }
  });
});

router.post("/updatepass", async (req, res, next) => {
  const users = await myDB.initializeUsers();
  const info = req.body;

  users.findOne({ username: info.username }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect("/account?error=User not found, please try again.");
    } else {
      users.updateOne(
        {
          username: info.username,
        },
        {
          $set: {
            password: authUtils.encrypt(info.newpassword),
          },
        }
      );

      res.redirect("/account?msg=Profile updated successfully.");
    }
  });
});
module.exports = router;
