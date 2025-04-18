const elasticClient = require('../config/elasticsearch');
const TextExtractor = require('./TextExtractor');

class ElasticsearchService {
  constructor() {
    this.indexName = 'documents';
  }

  async indexDocument(file, body) {
    try {
      const content = await TextExtractor.extractText(file);
      
      const document = {
        filename: file.originalname,
        content: content,
        size: file.size,
        uploadDate: new Date(),
        mimetype: file.mimetype,
        storeId: body.storeId,
        type: body.type,
        format: body.extension
      };

      const response = await elasticClient.index({
        index: this.indexName,
        body: document
      });

      // return document;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchDocuments(query) {
    try {
      const response = await elasticClient.search({
        index: this.indexName,
        body: {
          query: {
            bool: {
              must: [
                  {match: {"content" : query.keyword}},
                ],
                filter: [
                  query.type && {match: {"type" : query.type}},
                  query.format && {match: {"format" : query.format}},
              ]
            }
          }
        }
      });
      return response.hits.hits;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ElasticsearchService();