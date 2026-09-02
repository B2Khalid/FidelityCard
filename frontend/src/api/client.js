import axios from 'axios';

// Unico punto di configurazione delle chiamate HTTP.
// L'URL cambia tramite variabile d'ambiente, senza toccare il resto del codice.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
