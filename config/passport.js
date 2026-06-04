const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

function formatUsername(rawUsername, suffix) {
  const base = String(rawUsername || '').trim().replace(/\s+/g, '').toLowerCase();
  return suffix ? `${base}-${suffix}` : base;
}

async function generateUniqueUsername(rawUsername) {
  let username = formatUsername(rawUsername);
  let suffix = 0;

  while (await User.findOne({ username })) {
    suffix += 1;
    username = formatUsername(rawUsername, suffix);
  }

  return username;
}

const githubCallbackURL = process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL ||
  `${process.env.BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://glucometer-tracker.onrender.com' : 'http://localhost:3000')}/api/auth/github/callback`;

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
  callbackURL: githubCallbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub client ID configured:', !!process.env.GITHUB_CLIENT_ID);
    console.log('GitHub callback URL:', githubCallbackURL);
    console.log('GitHub profile id:', profile.id, 'username:', profile.username);

    // Try to find an existing GitHub user
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      const rawUsername = profile.username || profile.displayName || `github-${profile.id}`;
      const username = await generateUniqueUsername(rawUsername);

      // Create a new user with authType 'github'
      user = new User({
        authType: 'github',
        username,
        email: profile.emails?.[0]?.value || null,
        githubId: profile.id
      });

      try {
        await user.save();
      } catch (saveError) {
        if (saveError.code === 11000) {
          console.error('GitHub user save duplicate key error:', saveError);
          return done(null, false, { message: 'GitHub account cannot be linked because the username or email is already in use.' });
        }
        throw saveError;
      }
    }

    return done(null, user);
  } catch (err) {
    console.error('GitHub strategy error:', err);
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
