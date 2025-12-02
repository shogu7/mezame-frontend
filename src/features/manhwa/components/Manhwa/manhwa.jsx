import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../display/styles/manhwa.css';

const API_BASE = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/`
  : 'http://localhost:4000/api/';

export default function ManhwaList() {
  const [manhwa, setManhwa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchManhwa() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}manhwa`);
      if (res && res.data && res.data.ok) {

        setManhwa(Array.isArray(res.data.manhwa) ? res.data.manhwa : []);
      } else {
        setManhwa([]);
      }
    } catch (err) {
      console.error('Manhwa fetch error', err);
      setError('Impossible de récupérer la liste des manhwa.');
      setManhwa([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchManhwa();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  if (!manhwa.length) return (
    <div className="manhwa-list-container">
      <h2>All Manhwa</h2>
      {error && <p className="loading" style={{ color: 'red' }}>{error}</p>}
      <p className="loading">No manhwa found.</p>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchManhwa}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>
    </div>
  );

  return (
    <div className="manhwa-list-container">
      <h2>All Manhwa</h2>

      <ul className="manhwa-list">
        {manhwa.map(m => (
          <li key={m.manhwa_id} className="manhwa-item">
            <strong>{m.title}</strong> {m.original_title ? `(${m.original_title})` : ''} - Chapters: {m.total_chapters ?? 'N/A'}
            {m.description ? <p>{m.description}</p> : null}
          </li>
        ))}
      </ul>

      <Box className="manhwa-footer" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchManhwa}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>
    </div>
  );
}