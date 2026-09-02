const clientiService = require('../services/clientiService');

async function getAllClienti(req, res) {
  try {
    const clienti = await clientiService.getAllClientiConTier();
    res.json(clienti);
  } catch (err) {
    res.status(500).json({ errore: 'Errore interno del server' });
  }
}

async function getCliente(req, res) {
  try {
    const cliente = await clientiService.getClienteConTier(req.params.id);
    if (!cliente) {
      return res.status(404).json({ errore: 'Cliente non trovato' });
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ errore: 'Errore interno del server' });
  }
}

async function postTransazione(req, res) {
  try {
    const { importo } = req.body;
    const cliente = await clientiService.registraAcquisto(req.params.id, importo);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
}

async function getTiers(req, res) {
  res.json(clientiService.TIER_RULES);
}

module.exports = { getAllClienti, getCliente, postTransazione, getTiers };
