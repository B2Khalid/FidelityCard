// Scheletro per la Fase 2: stessa interfaccia del repository mock,
// ma legge/scrive sul database MySQL/MariaDB (quello gestito via phpMyAdmin,
// alimentato via FTP dal DB2 IBM).
//
// Per attivarlo:
//   1) npm install mysql2
//   2) completare la connessione qui sotto con le credenziali reali (in .env, mai committate)
//   3) impostare DATA_SOURCE=mysql nel file .env

// const mysql = require('mysql2/promise');
//
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

class ClientiRepositoryMysql {
  async getAll() {
    // const [rows] = await pool.query('SELECT * FROM clienti');
    // return rows;
    throw new Error('ClientiRepositoryMysql non ancora implementato');
  }

  async getById(id) {
    // const [rows] = await pool.query('SELECT * FROM clienti WHERE id = ?', [id]);
    // return rows[0] || null;
    throw new Error('ClientiRepositoryMysql non ancora implementato');
  }

  async updatePunti(id, nuoviPunti) {
    // await pool.query('UPDATE clienti SET puntiAccumulati = ? WHERE id = ?', [nuoviPunti, id]);
    // return this.getById(id);
    throw new Error('ClientiRepositoryMysql non ancora implementato');
  }
}

module.exports = new ClientiRepositoryMysql();
