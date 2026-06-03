const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

// Local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      const isValid = await user.validatePassword(password);
      if (!isValid) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to find an existing GitHub user
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      // Create a new user with authType 'github'
      user = new User({
        authType: 'github',
        username: profile.username || profile.displayName,
        email: profile.emails?.[0]?.value || null, // optional for GitHub
        githubId: profile.id
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));


// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id); // store MongoDB _id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
