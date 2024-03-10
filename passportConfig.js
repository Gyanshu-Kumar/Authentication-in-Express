const User = require("./database").User; // Import the User model directly
const LocalStrategy = require("passport-local").Strategy;

exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username }); // Correct variable name

        if (!user) return done(null, false);

        if (user.password !== password) return done(null, false);
        
        return done(null, user); // Authentication successful
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};

// For accessing Own Account....
exports.isAuthenticated = (req, res, done) => {
     if(req.user) return done();

     res.redirect("/login");
}