const express = require('express');
const cors = require('cors');
const clientiRoutes = require('./routes/clienti.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/clienti', clientiRoutes);

module.exports = app;
