const pdf = require('pdf-parse');
const docx = require('docx');
// const { extract } = require('txt-extract');
const mammoth = require('mammoth');

class TextExtractor {
  async extractText(file) {
    const { originalname, buffer } = file;
    const extension = originalname.split('.').pop().toLowerCase();
    
    try {
      switch (extension) {
        case 'pdf':
          const pdfData = await pdf(buffer);
          return pdfData.text;
        case 'docx':
          // Note: Cette implémentation est basique, vous pourriez avoir besoin d'une meilleure librairie pour docx
          // const docxText = await this.extractFromDocx(buffer);

          const result = await mammoth.extractRawText({ buffer });
          return result.value;
        case 'txt':
          return buffer.toString('utf-8');
        default:
          throw new Error('Format de fichier non supporté');
      }
    } catch (error) {
      throw new Error(`Erreur lors de l'extraction du texte: ${error.message}`);
    }
  }

  // async extractFromDocx(buffer) {
  //   // Implémentation basique pour docx - vous pourriez utiliser une meilleure librairie
  //   return "Contenu DOCX extrait (implémentation à améliorer)";
  // }
}

module.exports = new TextExtractor();