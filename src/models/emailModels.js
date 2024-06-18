const client = require('../../config/elasticsearch');

class EmailMessage {
  static async create(index, emailMessage) {
    const { body } = await client.index({
      index,
      body: emailMessage,
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

module.exports = EmailMessage;
