const passport = require('../../config/passportConfig');
const { syncEmails } = require('./emailService');

exports.redirectToOutlook = passport.authenticate('azuread-openidconnect', { scope: ['openid', 'profile', 'offline_access', 'User.Read', 'Mail.Read'] });

exports.handleOutlookCallback = (req, res, next) => {
  passport.authenticate('azuread-openidconnect', (err, user, info) => {
    console.log("🚀 ~ file: oauthService.js:7 ~ passport.authenticate ~ user:", user)
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      console.log('Outlook authentication successful:', user);
      try {
        await syncEmails(user._id);
        console.log('Email synchronization started');
      } catch (syncError) {
        console.error('Error during email synchronization:', syncError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};
