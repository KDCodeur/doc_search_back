const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middlewares/auth');
const blacklist = require('../auth/blacklist');


const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = 'votre_clé_secrète_super_sécurisée';

// 🔐 Inscription
router.post('/register', async (req, res) => {
  const { email, name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });
  res.status(201).json({ message: 'Utilisateur inscrit' });
});

// 🔑 Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// 🔒 Route protégée
router.get('/profile', verifyToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true }
  });
  res.json(user);
});

//  Liste
router.get('/users', verifyToken, async(req, res) => {
  const user = await prisma.user.findMany({ where: { email: {not: "admin"} } });
  res.json(user);
});

// Déconnexion
router.post('/logout', verifyToken, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    blacklist.add(token);
    res.json({ message: 'Déconnecté' });
  } else {
    res.status(400).json({ message: 'Aucun token' });
  }
});

module.exports = router;
