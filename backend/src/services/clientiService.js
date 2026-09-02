const { clientiRepository } = require('../repositories');

// Regole di clustering in base al fatturato annuo.
// Modificare solo qui per cambiare soglie o moltiplicatori punti.
const TIER_RULES = [
  { nome: 'Bronze', min: 0, max: 10000, moltiplicatore: 1 },
  { nome: 'Silver', min: 10001, max: 50000, moltiplicatore: 1.5 },
  { nome: 'Gold', min: 50001, max: 100000, moltiplicatore: 2 },
  { nome: 'Platinum', min: 100001, max: Infinity, moltiplicatore: 3 },
];

function calcolaTier(fatturatoAnnuo) {
  return TIER_RULES.find((t) => fatturatoAnnuo >= t.min && fatturatoAnnuo <= t.max);
}

async function getAllClientiConTier() {
  const clienti = await clientiRepository.getAll();
  return clienti.map((c) => {
    const tier = calcolaTier(c.fatturatoAnnuo);
    return { ...c, tier: tier.nome, moltiplicatorePunti: tier.moltiplicatore };
  });
}

async function getClienteConTier(id) {
  const cliente = await clientiRepository.getById(id);
  if (!cliente) return null;
  const tier = calcolaTier(cliente.fatturatoAnnuo);
  return { ...cliente, tier: tier.nome, moltiplicatorePunti: tier.moltiplicatore };
}

async function registraAcquisto(id, importoSpeso) {
  if (!importoSpeso || importoSpeso <= 0) {
    throw new Error('Importo speso non valido');
  }

  const cliente = await clientiRepository.getById(id);
  if (!cliente) {
    throw new Error('Cliente non trovato');
  }

  const tier = calcolaTier(cliente.fatturatoAnnuo);
  const puntiGuadagnati = Math.floor((importoSpeso / 10) * tier.moltiplicatore);
  const nuoviPunti = cliente.puntiAccumulati + puntiGuadagnati;

  const clienteAggiornato = await clientiRepository.updatePunti(id, nuoviPunti);
  return { ...clienteAggiornato, tier: tier.nome, puntiGuadagnati };
}

module.exports = {
  getAllClientiConTier,
  getClienteConTier,
  registraAcquisto,
  calcolaTier,
  TIER_RULES,
};
