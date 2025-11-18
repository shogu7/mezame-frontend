import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoBackButton from '../../../shared/components/buttons/GoBackButton.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';

const API_BASE = 'http://localhost:4000/api/';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function PanelAdminManhwa() {
  const [manhwas, setManhwas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadManhwas();
  }, []);

  async function loadManhwas() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}manhwa`, { headers: getAuthHeaders() });
      const data = res.data && res.data.manhwa ? res.data.manhwa : [];
      setManhwas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Impossible de récupérer les manhwa.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteManhwa(manhwaId, title) {
    if (!window.confirm(`Confirmer la suppression du manhwa "${title}" ?`)) return;
    setActionLoading(manhwaId);
    setError(null);
    try {
      const res = await axios.delete(`${API_BASE}manhwa/${manhwaId}`, { headers: getAuthHeaders() });
      if (res.status === 200 || res.status === 204 || (res.data && res.data.ok)) {
        setManhwas((m) => m.filter((x) => x.manhwa_id !== manhwaId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setError(err.response && (err.response.status === 401 || err.response.status === 403)
        ? 'Non autorisé.'
        : 'Suppression impossible.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', my: 4, px: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
          color: 'common.white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
            Panel Admin - Manhwa
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
              onClick={loadManhwas}
              sx={{ textTransform: 'none', borderRadius: 2, color: 'secondary.main', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Rafraîchir
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white', borderColor: 'rgba(255,255,255,0.08)' }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table size="small" sx={{ borderRadius: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'grey.400' }}>#</TableCell>
                <TableCell sx={{ color: 'grey.400' }}>Titre</TableCell>
                <TableCell sx={{ color: 'grey.400' }}>Auteur</TableCell>
                <TableCell sx={{ color: 'grey.400' }}>Statut</TableCell>
                <TableCell align="right" sx={{ color: 'grey.400' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {manhwas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'grey.400' }}>Aucun manhwa trouvé.</TableCell>
                </TableRow>
              ) : (
                manhwas.map((m, idx) => (
                  <TableRow key={m.manhwa_id}>
                    <TableCell sx={{ color: 'common.white' }}>{idx + 1}</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>{m.title}</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>{m.author || 'N/A'}</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>{m.status || 'Ongoing'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color="error"
                          onClick={() => deleteManhwa(m.manhwa_id, m.title)}
                          disabled={actionLoading === m.manhwa_id}
                          size="small"
                          sx={{ bgcolor: 'transparent' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Box sx={{ mt: 3 }}>
          <GoBackButton />
        </Box>
      </Paper>
    </Box>
  );
}
