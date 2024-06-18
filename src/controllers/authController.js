const { AuthorizationCode } = require('simple-oauth2');
const config = require('../../config/config');
const userService = require('../services/userService');

const oauth2 = new AuthorizationCode({
  client: {
    id: config.clientId,
    secret: config.clientSecret,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: `/${config.tenantId}/oauth2/v2.0/authorize`,
    tokenPath: `/${config.tenantId}/oauth2/v2.0/token`,
  },
});

function getAuthUrl() {
  const authorizationUri = oauth2.authorizeURL({
    redirect_uri: config.redirectUri,
    scope: ['openid', 'profile', 'email', 'offline_access', 'https://outlook.office.com/Mail.Read'],
    response_type: 'code',
  });
  return authorizationUri;
}

async function handleAuthCallback(req, res) {
  const { code } = req.query;

  const tokenConfig = {
    code: code,
    redirect_uri: config.redirectUri,
    scope: 'https://outlook.office.com/Mail.Read',
  };

  try {
    const accessToken = await oauth2.getToken(tokenConfig);
    const user = {
      id: code,
      accessToken: accessToken.token.access_token,
      refreshToken: accessToken.token.refresh_token,
    };
    await userService.createUser(user);
    res.send('Account created and logged in successfully');
  } catch (error) {
    console.error('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
}

module.exports = { getAuthUrl, handleAuthCallback };
