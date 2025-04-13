const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../auth/middlewere');

const router = express.Router();

// Simule une "base de données" en mémoire
const users = [];

const SECRET_KEY = 'votre_clé_secrète_super_sécurisée';

// 🔐 Inscription
router.post('/register', async (req, res) => {
  const { email, name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, name, role, password: hashedPassword });
  res.status(201).json({ message: 'Utilisateur inscrit' });
});

// 🔑 Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// 🔒 Route protégée
router.get('/profile', verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
