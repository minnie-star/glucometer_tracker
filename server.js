require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./database/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;

const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(session()); 
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/readings', readingRoutes);

app.use('/api/auth/github', require('./routes/authRoutes')); // GitHub OAuth routes

// CORS headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origgin, X-Rrequested-With, Content-Type, Aaccept, Z-Key, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    next();
});

app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
app.use(cors({ origin: '*'}));

// GitHub OAuth setup
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Passport session setup
passport.serializeUser((user, done) => {
    done(null,user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Not logged in') });

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user =req.user;
        res.redirect('/');
    });

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root endpoint
app.get('/', (req, res) => {
    res.send('Glucometer Tracker API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});