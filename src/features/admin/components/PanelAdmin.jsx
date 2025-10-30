import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoBackButton from '../../../shared/components/buttons/GoBackButton.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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

export default function PanelAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}admin/users`, {
        headers: getAuthHeaders(),
      });
      const data = res.data && res.data.users ? res.data.users : [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Impossible de récupérer les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId, currentIsAdmin) {
    setActionLoading(userId);
    setError(null);
    try {
      const res = await axios.put(
        `${API_BASE}admin/toggle-admin/${userId}`,
        {},
        { headers: getAuthHeaders() }
      );
      const newIsAdmin = res.data && typeof res.data.is_admin === 'boolean' ? res.data.is_admin : !currentIsAdmin;
      setUsers((u) => u.map((x) => (x.user_id === userId ? { ...x, is_admin: newIsAdmin } : x)));
    } catch (err) {
      setError(err.response && (err.response.status === 401 || err.response.status === 403) ? 'Non autorisé.' : 'Action impossible (promotion/démotion).');
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
    setActionLoading(userId);
    setError(null);
    try {
      const res = await axios.delete(`${API_BASE}admin/user/${userId}`, { headers: getAuthHeaders() });
      if (res.status === 200 || res.status === 204 || (res.data && res.data.ok)) {
        setUsers((u) => u.filter((x) => x.user_id !== userId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setError(err.response && (err.response.status === 401 || err.response.status === 403) ? 'Non autorisé.' : 'Suppression impossible.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', my: 4, px: 2 }}>
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
          <SettingsIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
            Panel Admin
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
              onClick={loadUsers}
              sx={{ textTransform: 'none', borderRadius: 2, color: 'secondary.main', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Rafraîchir
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white', borderColor: 'rgba(255, 255, 255, 0.08)' }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            <Table size="small" sx={{ borderRadius: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'grey.400' }}>#</TableCell>
                  <TableCell sx={{ color: 'grey.400' }}>Username</TableCell>
                  <TableCell sx={{ color: 'grey.400' }}>Email</TableCell>
                  <TableCell sx={{ color: 'grey.400' }}>Admin</TableCell>
                  <TableCell align="right" sx={{ color: 'grey.400' }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'grey.400' }}>Aucun utilisateur trouvé.</TableCell>
                  </TableRow>
                ) : (
                  users.map((u, idx) => (
                    <TableRow key={u.user_id}>
                      <TableCell sx={{ color: 'common.white' }}>{idx + 1}</TableCell>
                      <TableCell sx={{ color: 'common.white' }}>{u.username}</TableCell>
                      <TableCell sx={{ color: 'common.white' }}>{u.email}</TableCell>
                      <TableCell sx={{ color: 'common.white' }}>{u.is_admin ? 'Oui' : 'Non'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant={u.is_admin ? 'outlined' : 'contained'}
                            color="secondary"
                            size="small"
                            startIcon={<AdminPanelSettingsIcon />}
                            onClick={() => toggleAdmin(u.user_id, !!u.is_admin)}
                            disabled={actionLoading === u.user_id}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            {actionLoading === u.user_id ? '...' : u.is_admin ? 'Retirer admin' : 'Promouvoir admin'}
                          </Button>

                          <IconButton
                            color="error"
                            onClick={() => deleteUser(u.user_id)}
                            disabled={actionLoading === u.user_id}
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
          </>
        )}

        <Box sx={{ mt: 3 }}>
          <GoBackButton />
        </Box>
      </Paper>
    </Box>
  );
}
