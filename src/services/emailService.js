const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');
const User = require('../models/userModel');
const config = require('../../config/config');


const client = new Client({ node: config.elasticsearchHost });

const syncEmails = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("🚀 ~ file: emailService.js:12 ~ syncEmails ~ user:", user);
    if (!user) {
      throw new Error('User not found');
    }

    const response = await axios.get('https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const emails = response.data.value;
    console.log("🚀 ~ file: emailService.js:24 ~ syncEmails ~ emails:", emails);
    for (const email of emails) {
      await client.index({
        index: 'emails',
        body: {
          userId: userId,
          emailId: email.id,
          subject: email.subject,
          from: email.from.emailAddress.address,
          receivedDateTime: email.receivedDateTime,
        },
      });
    }
    console.log('Emails synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing emails:', error.message);
  }
};


const getEmailsForUser = async (userId) => {
  try {
    const body  = await client.search({
      index: 'emails',
      body: {
        query: {
          match: { userId }
        }
      }
    });
    console.log("🚀 ~ file: emailService.js:48 ~ getEmailsForUser ~ body:", body)
  
    return body.hits.hits.map(hit => hit._source);
  } catch (error) {
    console.log("🚀 ~ file: emailService.js:48 ~ getEmailsForUser ~ body:", error);
  }
  
};

module.exports = { syncEmails, getEmailsForUser };
