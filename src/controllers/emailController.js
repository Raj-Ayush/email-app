const { syncEmails, getEmailsForUser } = require('../services/emailService');

const syncEmailsController = async (req, res) => {
  const { userId, accessToken } = req.body; // Retrieve this information from your database
  try {
    await syncEmails(accessToken, userId);
    res.status(200).send('Emails synchronized successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

const getEmailsControlller = async (req, res) => {
  try {
    const { user } = req;
    console.log("🚀 ~ file: emailController.js:16 ~ getEmailsControlller ~ user:", user);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    console.log("🚀 ~ file: emailController.js:19 ~ getEmailsControlller ~ user:", user);

    const emails = await getEmailsForUser(user.outlookId);
    res.json(emails);
  } catch (error) {
    res.status(500).send('Error fetching emails');
  }
}

module.exports = { syncEmailsController, getEmailsControlller };
