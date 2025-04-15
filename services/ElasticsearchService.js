const elasticClient = require('../config/elasticsearch');
const textExtractor = require('./TextExtractor');

class ElasticsearchService {
  constructor() {
    this.indexName = 'documents';
  }

  async indexDocument(file) {
    try {
      const content = await textExtractor.extractText(file);
      
      const document = {
        filename: file.originalname,
        content: content,
        size: file.size,
        uploadDate: new Date(),
        mimetype: file.mimetype
      };

      const response = await elasticClient.index({
        index: this.indexName,
        body: document
      });

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
            match: {
              content: query
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