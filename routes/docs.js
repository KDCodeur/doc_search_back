const { error, log } = require('console');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/role');
const ElasticsearchService = require('../services/ElasticsearchService');
const { PrismaClient } = require('@prisma/client');

const fs = require('fs');
// const upload = require('../middlewares/upload');
const multer = require('multer');
const path = require('path');

const upload = multer();
const prisma = new PrismaClient();

// READ ALL
router.get('/', async(req, res) => {
  const docs = await prisma.doc.findMany();
  res.json(docs);
});

// UPLOAD
// router.post('/', verifyToken, authorizeRoles('admin'), (req, res) => {
router.post('/', verifyToken, upload.single('document'), async (req, res) => {
  const { file } = req
  const type = req.body.type
  try {
    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const date = Date.now()
    const storeId = Date.now().toString();
    const extension = file.originalname.split('.').pop().toLowerCase();
    fs.writeFileSync(`uploads/${storeId +"."+ extension}`, file.buffer);

    const doc = await prisma.doc.create({
      data: { name: file.originalname, 
        storeId, 
        extension, 
        userId: req.user.id, 
        type: type,  
        createAt: new Date(), 
        updateAt: new Date(),
      },
    });

    const result = await ElasticsearchService.indexDocument(file, {storeId: doc.id, type, extension});
    
    res.status(201).json({
      message: 'Document indexé avec succès',
      // documentId: result.content
      // documentId: result.body._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DOWNLOAD FILE
router.get('/download/:id', async(req, res) => {
  const doc = await prisma.doc.findUnique({
    where: { id: parseInt(req.params.id) },
  });
    const filePath = path.join(__dirname, '../uploads', doc.storeId + "." + doc.extension);
    // res.json({name: doc.name, extension: doc.extension})
    res.download(filePath, err => {
        if (err) {
            res.status(404).send('Fichier non trouvé.');
        }
    });
});

// SEARCH
router.get('/search', async(req, res) => {
  try {
    const { keyword, type, format } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Le paramètre de recherche est requis' });
    }

    const results = await ElasticsearchService.searchDocuments({keyword, type, format});
    res.status(200).json({results, keyword});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async(req, res) => {
  const doc = await prisma.doc.findUnique({
    where: { id: parseInt(req.params.id) },
  })
  try {
    await prisma.doc.delete({
      where: { id: parseInt(req.params.id) },
    })
    
    fs.unlink("uploads/"+doc.name+"."+doc.extension, (err) => {
      if (err) throw err;
    });
    
    res.status(200).json({ message: 'Document supprimé' });
  }
  catch(err) {
    res.status(404).json({ message: 'Document non trouvé' });
  }
});

// MULTI DELETE
router.delete('/', async(req, res) => {

    const {elements} = req.body
    let wrong_elements = []

    for (let id = 0; id < elements.length; id++) {
      try {
          await prisma.doc.delete({
            where: { id: parseInt(id) },
          })
          await fs.unlink();
        }
        catch(err) {
          wrong_elements.push(elements)
        }
    }
    
    if(wrong_elements.length == 1){
        res.status(404).json({ message: 'Un document non trouvé' });
    }else if (wrong_elements.length > 1) {
        res.status(404).json({ message: 'Plusieurs documents n\'ont pas étés trouvés' });
    }else{
        res.json({ message: 'Tous les documents ont étés supprimé' });
    }
});

module.exports = router;
