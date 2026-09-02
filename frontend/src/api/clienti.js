import { apiClient } from './client';

export const clientiApi = {
  getAll: () => apiClient.get('/clienti').then((r) => r.data),
  getById: (id) => apiClient.get(`/clienti/${id}`).then((r) => r.data),
  registraTransazione: (id, importo) =>
    apiClient.post(`/clienti/${id}/transazioni`, { importo }).then((r) => r.data),
  getTiers: () => apiClient.get('/clienti/tiers').then((r) => r.data),
};
