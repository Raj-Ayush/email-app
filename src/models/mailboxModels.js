const client = require('../../config/elasticsearch');

class Mailbox {
  static async create(index, mailbox) {
    const { body } = await client.index({
      index,
      body: mailbox,
    });
    return body;
  }

  static async findById(index, id) {
    const { body } = await client.get({
      index,
      id,
    });
    return body;
  }
}

module.exports = Mailbox;
