// Punto di switch tra sorgente dati finta e reale.
// Cambia solo DATA_SOURCE nel file .env: nessun altro file del progetto deve cambiare.

const dataSource = process.env.DATA_SOURCE || 'mock';

const clientiRepository =
  dataSource === 'mysql'
    ? require('./clientiRepository.mysql')
    : require('./clientiRepository.mock');

module.exports = { clientiRepository };
