const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const User = require('../src/models/userModel'); // Assuming you have a User model for Elasticsearch

const options = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.OUTLOOK_CLIENT_ID,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  responseType: 'code',
  responseMode: 'query',
  redirectUrl: process.env.REDIRECT_URI,
  allowHttpForRedirectUrl: true,
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['openid', 'profile', 'offline_access', 'User.Read', 'Mail.Read']
};

// Assuming proper imports and environment variables are set

passport.use(new OIDCStrategy(options, async (iss, sub, profile, accessToken, refreshToken, done) => {
    // console.log("🚀 ~ file: passportConfig.js:21 ~ passport.use ~ profile:", profile);
    try {
      if (!profile.oid) {
        throw new Error("No OID found in user profile.");
      }
  
      // Retrieve user from Elasticsearch by Outlook ID
      let user = await User.findById(profile.oid);
  
      if (!user) {
        // User not found, create a new user
        const email = profile._json.preferred_username || profile.email;

        const newUser = {
          outlookId: profile.oid,
          accessToken,
          refreshToken,
          email
        };
        // Create new user document in Elasticsearch
        user = await User.create(newUser);
      } else {
        // Update access and refresh tokens for existing user
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        // Update user document in Elasticsearch
        user = await User.updateUser(profile.oid, user);
    }
  
      // Return user to Passport authentication flow
      return done(null, user);
    } catch (err) {
      // Pass any encountered errors to Passport
      return done(err);
    }
  }));
  
  // Serialization and deserialization functions...
  
  module.exports = passport;
  

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // // console.log("🚀 ~ file: passportConfig.js:68 ~ passport.deserializeUser ~ done:", done);
  // console.log("🚀 ~ file: passportConfig.js:68 ~ passport.deserializeUser ~ id:", id);
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

module.exports = passport;
