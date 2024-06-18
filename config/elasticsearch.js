const { Client } = require('@elastic/elasticsearch');
const config = require('./config');

const client = new Client({ node: config.elasticsearchHost });

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
    // console.log("🚀 ~ file: elasticsearch.js ~ ensureIndexExists ~ error:", error.meta.body.error.type);
    if (error?.meta?.body?.error?.type === 'resource_already_exists_exception') {
      console.log(`Index ${index} already exists.`);
    } else {
      console.error('Error ensuring index exists:', error);
      throw error;
    }
  }
}

module.exports = { client, ensureIndexExists };
