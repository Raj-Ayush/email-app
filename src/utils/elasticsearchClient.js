const { Client } = require('@elastic/elasticsearch');
const config = require('../../config/config')

const client = new Client({ node: config.elasticsearchHost });

async function testConnection() {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch cluster health:', health);
  } catch (error) {
    console.error('Elasticsearch connection error:', error);
  }
}

testConnection();
