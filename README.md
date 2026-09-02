# Fidelity Card — progetto base

Struttura a due parti: `backend` (Node.js/Express) e `frontend` (React + Vite),
collegate tramite API REST. In Fase 1 il backend usa dati fittizi (`backend/src/data/clienti.json`);
in Fase 2 basterà completare `clientiRepository.mysql.js` e impostare `DATA_SOURCE=mysql`.

## Avvio backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Il server parte su `http://localhost:3001`. Endpoint disponibili:
- `GET /api/clienti` — lista clienti con tier calcolato
- `GET /api/clienti/:id` — dettaglio singolo cliente
- `GET /api/clienti/tiers` — regole dei cluster/tier
- `POST /api/clienti/:id/transazioni` — body `{ "importo": 250 }`, registra un acquisto e assegna i punti

## Avvio frontend

```bash
cd frontend
npm install
npm run dev
```

L'app parte su `http://localhost:5173` e chiama automaticamente il backend su `http://localhost:3001/api`
(configurato in `frontend/.env.development`).

## Passaggio alla Fase 2 (dati reali)

1. Installare il driver: `cd backend && npm install mysql2`
2. Completare `backend/src/repositories/clientiRepository.mysql.js` con le query verso
   il database MySQL/MariaDB (quello gestito via phpMyAdmin, alimentato via FTP dal DB2 IBM)
3. Compilare le credenziali `DB_*` nel file `.env`
4. Impostare `DATA_SOURCE=mysql` nel `.env`

Nessuna modifica è necessaria a controller, service, routes o frontend: parlano tutti
con la stessa interfaccia, indipendentemente da dove arrivano i dati.
