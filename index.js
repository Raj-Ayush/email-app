require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const passport = require('./config/passportConfig');
const config = require('./config/config');
const { ensureIndexExists } = require('./config/elasticsearch'); 
const indexRoutes = require('./src/routes/index');
const userRoutes = require('./src/routes/userRoutes');
const emailRoutes = require('./src/routes/emailRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

(async () => {
    try {
      await ensureIndexExists('users');
      await ensureIndexExists('emails');
      console.log('Elasticsearch index check complete.');
    } catch (error) {
      console.error('Error ensuring index exists:', error);
    }
})();


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', indexRoutes);
app.use('/', userRoutes);
app.use('/api', emailRoutes);

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
