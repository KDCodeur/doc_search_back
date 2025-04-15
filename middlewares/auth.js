const jwt = require('jsonwebtoken');
const SECRET_KEY = 'votre_clé_secrète_super_sécurisée';
const blacklist = require('../auth/blacklist');


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (blacklist.has(token)) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = { verifyToken };
