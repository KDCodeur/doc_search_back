const jwt = require('jsonwebtoken');
const SECRET_KEY = 'dopafjiz_djfap_ffjjzpofe';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = { verifyToken };
