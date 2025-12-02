import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Alert
} from '@mui/material';
import CardManhwa from '../../collection/manhwaCard';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

export default function ProfileLibrary({ userId }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search] = useState('');

  const fetchPage = useCallback(async (p = page, ps = pageSize, s = search) => {
    setLoading(true);
    setError('');
    try {
      // fetch this user's library from the API for the given page and pageSize
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('pageSize', String(ps));
      if (s) params.set('search', s);
      const res = await fetch(`${API_BASE}user/${encodeURIComponent(userId)}/library?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (!data || !data.ok) {
        throw new Error(data?.error || 'Failed to load library');
      }
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.total || 0));
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(err.message || 'Fetch error');
    } finally {
      setLoading(false);
    }
  }, [userId, page, pageSize, search]);

  useEffect(() => {
    fetchPage(page, pageSize, search);
  }, [fetchPage, page, pageSize, search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  // return error
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Library ({total})
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={40}>40</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No manhwa in this library.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((m) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={m.id || m.manhwa_id}>
                <CardManhwa manhwa={m} onClick={() => window.location.href = `/manhwa/${m.id}`} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
