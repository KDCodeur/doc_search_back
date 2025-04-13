const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/docs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/docs', docRoutes);

const LAN = "192.168.137.1"
const LOCAL = "localhost"

app.listen(PORT, () => {
  console.log(`Serveur lancé sur ${LOCAL}:${PORT}`);
});
