import { useClienti } from '../hooks/useClienti';

const TIER_COLORS = {
  Bronze: '#a17347',
  Silver: '#8a8a8a',
  Gold: '#c99a2e',
  Platinum: '#5b5fc7',
};

export default function ListaClienti() {
  const { clienti, loading, error } = useClienti();

  if (loading) return <p>Caricamento clienti...</p>;
  if (error) return <p>Errore nel caricamento dei dati. Il backend è avviato?</p>;

  return (
    <div>
      <h1>Clienti fidelity card</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Ragione sociale</th>
            <th style={cellStyle}>Fatturato annuo</th>
            <th style={cellStyle}>Tier</th>
            <th style={cellStyle}>Punti accumulati</th>
          </tr>
        </thead>
        <tbody>
          {clienti.map((c) => (
            <tr key={c.id}>
              <td style={cellStyle}>{c.ragioneSociale}</td>
              <td style={cellStyle}>{c.fatturatoAnnuo.toLocaleString('it-IT')} €</td>
              <td style={{ ...cellStyle, color: TIER_COLORS[c.tier], fontWeight: 600 }}>
                {c.tier}
              </td>
              <td style={cellStyle}>{c.puntiAccumulati}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ddd',
  padding: '8px 12px',
  textAlign: 'left',
};
