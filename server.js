const express = require("express");
const app = express();
const { connectMongoose, User } = require("./database.js");
const expressSession = require("express-session");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig.js");
// Call the connectMongoose function to establish the database connection
connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To Use Passport..
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  // Handle registration logic here
  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");

  const newuser = await User.create(req.body);

  res.status(201).send(newuser);
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/",
  })
);

app.get("/profile", isAuthenticated, (req, res) => {
    res.send(req.user);
});

// For Logout...
app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
})


app.listen(3000, () => {
  console.log("Listening on 3000");
});
