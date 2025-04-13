const { error } = require('console');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/middlewere');
const { authorizeRoles } = require('../auth/role');


let docs = []; // stock en mémoire
let idCounter = 1;

// CREATE
router.post('/', verifyToken, authorizeRoles('admin'), (req, res) => {
  const { name, content, type } = req.body;
  const docs = { id: idCounter++, content, type, name };
  // docs.push(docs);
  res.status(201).json(docs);
});

// READ ALL
router.get('/', (req, res) => {
  res.json(docs);
});

// READ ONE
router.get('/:id', (req, res) => {
  const doc = docs.find(u => u.id == req.params.id);
  if (doc) res.json(doc);
  else res.status(404).json({ message: 'Document non trouvé' });
});

// UPDATE
router.put('/:id', (req, res) => {
  const doc = docs.find(u => u.id == req.params.id);
  if (doc) {
    doc.name = req.body.name || doc.name;
    doc.email = req.body.content || doc.content;
    doc.email = req.body.type || doc.type;
    res.json(doc);
  } else {
    res.status(404).json({ message: 'Document non trouvé' });
  }
});

// DELETE
router.delete('/:id', (req, res) => {
  const index = docs.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    docs.splice(index, 1);
    res.json({ message: 'Document supprimé' });
  } else {
    res.status(404).json({ message: 'Document non trouvé' });
  }
});

// MULTI DELETE
router.delete('/', (req, res) => {

    const elements = req.body.elements
    let errors = []

    for (let id = 0; id < elements.length; id++) {
        const element = elements[id];
        
        const index = docs.findIndex(u => u.id == element.id);
        if (index.id !== -1) {
          docs.splice(index.id, 1);
        } else {
            errors.push(index)
        }
    }
    
    if(errors.length == 1){
        res.status(404).json({ message: 'Document non trouvé' });
    }else if (errors.length > 1) {
        res.status(404).json({ message: 'Plusieurs documents non trouvés' });
    }else{
        res.json({ message: 'Documents supprimé' });
    }
});

module.exports = router;
