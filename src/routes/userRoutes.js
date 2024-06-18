const express = require('express');
const router = express.Router();
const authService = require('../services/oauthService');
const emailService = require('../services/emailService');
const mailboxService = require('../services/mailBoxService');

router.get('/auth/outlook', authService.redirectToOutlook);
router.get('/auth/outlook/callback', authService.handleOutlookCallback);

router.post('/emails', async (req, res) => {
  try {
    const { userId, emailMessage } = req.body;
    const result = await emailService.saveEmailMessage(userId, emailMessage);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/emails/:userId/:messageId', async (req, res) => {
  try {
    const { userId, messageId } = req.params;
    const result = await emailService.getEmailMessage(userId, messageId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/mailboxes', async (req, res) => {
  try {
    const { userId, mailbox } = req.body;
    const result = await mailboxService.saveMailbox(userId, mailbox);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mailboxes/:userId/:mailboxId', async (req, res) => {
  try {
    const { userId, mailboxId } = req.params;
    const result = await mailboxService.getMailbox(userId, mailboxId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
