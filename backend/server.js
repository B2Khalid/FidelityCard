require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend fidelity card in ascolto su http://localhost:${PORT}`);
  console.log(`Sorgente dati attiva: ${process.env.DATA_SOURCE || 'mock'}`);
});
