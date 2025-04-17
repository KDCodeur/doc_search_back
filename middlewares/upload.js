const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Garde le fichier en mémoire comme Buffer

// const fileFilter = (req, file, cb) => {
//   const filetypes = /pdf|docx|txt/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb('Error: Seuls les fichiers PDF, DOCX et TXT sont autorisés!');
//   }
// };

const fileFilter = (req, file, cb) => {
  // 1. Vérification de l'extension du fichier
  const extname = path.extname(file.originalname).toLowerCase();
  
  // 2. Liste des extensions autorisées
  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  
  // 3. Liste des types MIME correspondants
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  // 4. Vérification double (extension ET type MIME)
  const isValidExtension = allowedExtensions.includes(extname);
  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

  // 5. Décision d'acceptation
  if (isValidExtension && isValidMimeType) {
    // Fichier valide
    return cb(null, true);
  } else {
    // Fichier invalide - création d'un message d'erreur détaillé
    const error = new Error('Type de fichier non supporté');
    
    // Ajout de détails pour le débogage
    error.details = {
      received: {
        filename: file.originalname,
        extension: extname,
        mimetype: file.mimetype
      },
      expected: {
        extensions: allowedExtensions,
        mimetypes: allowedMimeTypes
      }
    };
    
    // On passe l'erreur au callback
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

module.exports = upload;