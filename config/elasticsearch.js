const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'MR-QlgLUkc1Tmhg1Vwx5'
  }
});

module.exports = elasticClient;