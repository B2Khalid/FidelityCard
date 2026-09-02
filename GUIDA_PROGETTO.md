# Fidelity Card aziendale — Guida al progetto

Questa guida raccoglie tutto quello che serve per iniziare a lavorare sul progetto, capire come è strutturato, e sapere cosa fare per collegarlo in futuro ai dati reali.

---

## 1. Obiettivo del progetto

Sistema di fidelity card per clienti aziendali (B2B). I clienti vengono raggruppati in **tier/cluster in base al fatturato annuo**, e ogni tier ha un moltiplicatore diverso per l'accumulo punti.

Regole attuali (modificabili solo in un punto del codice, vedi sezione 5):

| Tier | Fatturato annuo | Moltiplicatore punti |
|------|------------------|----------------------|
| Bronze | 0 – 10.000 € | 1x |
| Silver | 10.001 – 50.000 € | 1,5x |
| Gold | 50.001 – 100.000 € | 2x |
| Platinum | oltre 100.000 € | 3x |

I punti si calcolano così: `(importo_speso / 10) * moltiplicatore_tier`.

---

## 2. Come è organizzato il repository

```
/FidelityCard
  /backend     → API Node.js/Express (la tua parte)
  /frontend    → App React (la mia parte)
  README.md    → istruzioni rapide di avvio
```

Le due parti comunicano **solo tramite API REST** — nessun accesso diretto al database dal frontend.

---

## 3. Come clonare e iniziare a lavorare

```bash
git clone https://github.com/B2Khalid/FidelityCard.git
cd FidelityCard
```

**Importante — workflow che useremo d'ora in poi:**
Per evitare che ci sovrascriviamo a vicenda (come è già successo), da ora lavoriamo così:

1. Prima di iniziare qualsiasi modifica: `git pull origin main` (per essere allineati)
2. Crea un tuo branch dedicato: `git checkout -b backend-sviluppo`
3. Lavora, fai commit frequenti sul tuo branch
4. Push del tuo branch: `git push -u origin backend-sviluppo`
5. Apri una Pull Request su GitHub verso `main`
6. Ci rivediamo il codice a vicenda prima del merge

Mai lavorare direttamente su `main`.

---

## 4. Setup ambiente locale (backend)

Requisiti: **Node.js** (versione 18 o superiore) installato.

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Il server parte su `http://localhost:3001`. Verifica che funzioni aprendo nel browser:
`http://localhost:3001/api/health` → deve rispondere `{"status":"ok"}`

---

## 5. Architettura del backend (importante da capire prima di modificare)

Il codice è diviso in 3 livelli, ognuno con una responsabilità precisa:

```
src/
  controllers/   → riceve le richieste HTTP, richiama il service, risponde
  services/      → logica di business (calcolo tier, calcolo punti)
  repositories/  → unico punto che legge/scrive i dati
  routes/        → definizione degli URL delle API
  data/          → dati finti (JSON) usati in Fase 1
```

**Regola d'oro**: ogni livello parla solo con quello sotto. Il controller non deve mai contenere logica di calcolo punti, e il service non deve mai sapere come sono salvati i dati.

### Dove modificare cosa

- Vuoi cambiare le soglie dei tier o i moltiplicatori? → `src/services/clientiService.js`, oggetto `TIER_RULES`
- Vuoi aggiungere un nuovo endpoint? → crea il metodo nel controller, aggiungilo alle routes
- Vuoi cambiare da dove arrivano i dati? → tocchi solo i file dentro `repositories/`

### File chiave da conoscere

| File | Cosa fa |
|------|---------|
| `src/repositories/clientiRepository.mock.js` | Dati finti (Fase 1), già funzionante |
| `src/repositories/clientiRepository.mysql.js` | Scheletro da completare per la Fase 2 (dati reali) |
| `src/repositories/index.js` | Switch automatico tra mock e mysql, basato su variabile d'ambiente |
| `src/services/clientiService.js` | Tutta la logica di business (tier, punti) |
| `src/controllers/clientiController.js` | Gestione richieste HTTP |
| `src/routes/clienti.routes.js` | Elenco degli URL disponibili |

---

## 6. Contratto API (cosa il frontend si aspetta)

Questo è il punto **più importante da rispettare**: il frontend è già scritto e si aspetta esattamente questi endpoint e questi formati di risposta. Se cambi qualcosa qui, avvisami perché dovrò aggiornare anche il frontend.

### `GET /api/clienti`
Restituisce la lista di tutti i clienti con tier calcolato.

```json
[
  {
    "id": "C001",
    "ragioneSociale": "Rossi Srl",
    "fatturatoAnnuo": 8500,
    "puntiAccumulati": 320,
    "tier": "Bronze",
    "moltiplicatorePunti": 1
  }
]
```

### `GET /api/clienti/:id`
Restituisce un singolo cliente. Se non esiste: status 404.

### `GET /api/clienti/tiers`
Restituisce le regole dei tier (soglie e moltiplicatori).

### `POST /api/clienti/:id/transazioni`
Registra un acquisto e assegna i punti.

Richiesta:
```json
{ "importo": 250 }
```

Risposta:
```json
{
  "id": "C001",
  "ragioneSociale": "Rossi Srl",
  "fatturatoAnnuo": 8500,
  "puntiAccumulati": 345,
  "tier": "Bronze",
  "puntiGuadagnati": 25
}
```

**Se aggiungi nuovi endpoint** (es. storico transazioni, autenticazione utenti), documentali qui sotto o dimmelo così aggiorniamo insieme questa sezione.

---

## 7. Fase 2 — Collegamento ai dati reali (DB2 → phpMyAdmin → backend)

Questo è il passaggio più delicato, va fatto con attenzione.

### Chiarimento sull'infrastruttura dati

- **phpMyAdmin non è un database**, è solo un'interfaccia web di amministrazione
- Dietro c'è un database **MySQL o MariaDB**
- Quel database riceve i dati **via FTP dal DB2 IBM aziendale** (probabilmente con una sincronizzazione periodica/notturna, da verificare)
- Il backend si collegherà **direttamente al MySQL/MariaDB**, non a phpMyAdmin

### Informazioni da recuperare prima di iniziare (chiedile a chi gestisce il server)

- [ ] Host/IP del server MySQL (potrebbe essere diverso dall'indirizzo di phpMyAdmin)
- [ ] Porta (di solito 3306)
- [ ] Nome utente e password con permessi di lettura (e scrittura, se serve aggiornare i punti direttamente lì)
- [ ] Nome del database
- [ ] Se il server è raggiungibile da remoto o solo dalla rete aziendale (serve una VPN?)
- [ ] Nome esatto delle tabelle e dei campi che contengono: anagrafica cliente, fatturato, eventuali punti già esistenti
- [ ] Con che frequenza avviene la sincronizzazione via FTP dal DB2 (giornaliera? notturna? in tempo reale?)
- [ ] Se i dati importati vanno considerati "grezzi" (possibili null, formati inconsistenti) o già puliti

### Cosa implementare tecnicamente

1. Installare il driver:
   ```bash
   npm install mysql2
   ```

2. Completare il file `src/repositories/clientiRepository.mysql.js` (contiene già lo scheletro con i commenti su cosa scrivere)

3. Compilare le variabili nel file `.env`:
   ```
   DB_HOST=...
   DB_PORT=3306
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   ```

4. Cambiare `DATA_SOURCE=mock` in `DATA_SOURCE=mysql` nel `.env`

**Nessun altro file deve essere toccato** — non il controller, non il service, non le routes, non il frontend. È l'intero scopo di questa architettura a livelli.

### Attenzione alla qualità dei dati

Dato che i dati arrivano da un sistema esterno (DB2) tramite un processo di importazione (FTP), è molto probabile trovare:
- Campi null o vuoti
- Formati numerici o date inconsistenti
- Duplicati

Consiglio: se possibile, creare una **vista SQL dedicata** (o tabelle "pulite" separate) per l'app, invece di leggere direttamente dalle tabelle grezze di importazione. Così si isola la logica di pulizia dati in un solo posto.

---

## 8. Sicurezza — regole da rispettare sempre

- Il file `.env` **non va mai committato su Git** (è già escluso via `.gitignore`, ma controlla sempre prima di un commit)
- Le credenziali del database restano solo nel backend, mai esposte al frontend
- Il frontend non deve mai fare query dirette al database — sempre e solo tramite le API
- Se in futuro l'app avrà utenti che accedono ai propri dati, andrà aggiunta autenticazione (es. JWT) — da pianificare insieme quando sarete a quel punto

---

## 9. Convenzioni di codice

- Nomi di funzioni e variabili in italiano o inglese, basta essere coerenti nel file (nel progetto attuale ho usato italiano per i nomi legati al dominio business — es. `fatturatoAnnuo`, `puntiAccumulati` — così restano leggibili anche a chi non è sviluppatore)
- Messaggi di commit brevi e descrittivi, es: `git commit -m "Aggiunta connessione MySQL al repository clienti"`
- Prima di ogni Pull Request, verifica che il server parta senza errori con `npm run dev`

---

## 10. Prossimi passi consigliati

1. Setup ambiente locale e verifica che il backend mock funzioni (sezione 4)
2. Rivedere insieme il contratto API (sezione 6) — se serve aggiungere endpoint per la tua parte, ne parliamo prima di scriverli
3. Recuperare le informazioni di accesso al database (checklist sezione 7)
4. Implementare `clientiRepository.mysql.js`
5. Test in locale con `DATA_SOURCE=mysql` prima di andare in produzione

---

Per qualsiasi dubbio su come il frontend consuma le API, o se serve cambiare qualcosa nel contratto dati, parliamone prima di modificare — così evitiamo di disallinearci.
