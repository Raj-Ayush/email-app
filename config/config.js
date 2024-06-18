require('dotenv').config();

module.exports = {
  outlookClientId: process.env.OUTLOOK_CLIENT_ID,
  outlookClientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  elasticsearchHost: process.env.ELASTICSEARCH_HOST,
  port: process.env.PORT || 3000,
};
