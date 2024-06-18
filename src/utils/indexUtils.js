const { client } = require('../../config/elasticsearch');

async function ensureIndexExists(index) {
  try {
    const exists = await client.indices.exists({ index });
    if (!exists.body) {
      await client.indices.create({ index });
      console.log(`Index ${index} created.`);
    } else {
      console.log(`Index ${index} already exists.`);
    }
  } catch (error) {
    console.log("🚀 ~ file: elasticsearch.js:13 ~ ensureIndexExists ~ error:", error.meta);
    if (error.meta.body.error.type === 'resource_already_exists_exception') {
      console.log(`Index ${index} already exists.`);
    } else {
      console.error('Error ensuring index exists:', error);
      throw error;
    }
  }
}

module.exports = { ensureIndexExists };
