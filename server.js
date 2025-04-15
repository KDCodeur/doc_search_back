const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/docs');

const app = express();

app.use(cors({
  
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  
}));
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/docs', docRoutes);

const PORT = 3000;
const LAN = "192.168.137.1"
const LOCAL = "localhost"

app.listen(PORT, () => {
  console.log(`Serveur lancé sur ${LOCAL}:${PORT}`);
});
