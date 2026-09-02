// Repository "finto": legge e scrive su un file JSON in memoria.
// Ha volutamente gli STESSI metodi che avrà clientiRepository.mysql.js in Fase 2,
// cosi' service/controller/routes non dovranno mai cambiare.

const clienti = require('../data/clienti.json');

class ClientiRepositoryMock {
  async getAll() {
    return clienti;
  }

  async getById(id) {
    return clienti.find((c) => c.id === id) || null;
  }

  async updatePunti(id, nuoviPunti) {
    const cliente = clienti.find((c) => c.id === id);
    if (!cliente) return null;
    cliente.puntiAccumulati = nuoviPunti;
    return cliente;
  }
}

module.exports = new ClientiRepositoryMock();
