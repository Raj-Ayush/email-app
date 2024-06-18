const Mailbox = require('../models/mailboxModels');

class MailboxService {
  static async saveMailbox(userId, mailbox) {
    const index = `mailboxes_${userId}`;
    return await Mailbox.create(index, mailbox);
  }

  static async getMailbox(userId, mailboxId) {
    const index = `mailboxes_${userId}`;
    return await Mailbox.findById(index, mailboxId);
  }
}

module.exports = MailboxService;
