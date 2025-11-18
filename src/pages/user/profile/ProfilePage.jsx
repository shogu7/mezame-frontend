// src/pages/user/profile/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Pagination,
  Stack,
  Chip,
} from '@mui/material';
import CardManhwa from '../collection/manhwaCard';
import { getField } from '../collection/hook/getField';
import { useAuth } from '../../../shared/context/authContext';

export default function ProfilePage() {
  const { userId: paramUserId } = useParams();
  const { user: authUser } = useAuth();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

  const [resolvedUserId, setResolvedUserId] = useState(null);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [library, setLibrary] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [libraryError, setLibraryError] = useState(null);

  const [filters] = useState({ search: '', genres: [], author: null });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0 });

  useEffect(() => {
    if (paramUserId) {
      setResolvedUserId(paramUserId);
      return;
    }
    if (authUser && (authUser.username || authUser.user_id)) {
      setResolvedUserId(authUser.username || authUser.user_id);
      return;
    }
    setResolvedUserId(null);
  }, [paramUserId, authUser]);

  useEffect(() => {
    if (!resolvedUserId) return;
    const ac = new AbortController();
    (async () => {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const res = await fetch(`${API_BASE}user/${encodeURIComponent(resolvedUserId)}`, { signal: ac.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!data || !data.ok) throw new Error(data?.error || 'Invalid response');
        setProfile(data.user);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setProfile(null);
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    })();
    return () => ac.abort();
  }, [resolvedUserId, API_BASE]);

  useEffect(() => {
    if (!resolvedUserId) return;
    const ac = new AbortController();
    (async () => {
      setLoadingLibrary(true);
      setLibraryError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          search: filters.search || '',
        });
        const url = `${API_BASE}user/${encodeURIComponent(resolvedUserId)}/library?${params.toString()}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!data || !data.ok) throw new Error(data?.error || 'Invalid library response');
        setLibrary(Array.isArray(data.items) ? data.items : []);
        setTotalPages(Math.max(1, Math.ceil((data.total || 0) / pageSize)));
        const reading = (data.items || []).filter(i => i.status === 'reading').length;
        const completed = (data.items || []).filter(i => i.status === 'completed').length;
        setStats({ total: Number(data.total || 0), reading, completed });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setLibrary([]);
        setLibraryError(err.message || 'Failed to load library');
      } finally {
        setLoadingLibrary(false);
      }
    })();
    return () => ac.abort();
  }, [resolvedUserId, page, pageSize, filters, API_BASE]);

  const handleOpenManhwa = (m) => {
    const slug = getField(m, 'slug') || getField(m, 'id');
    if (slug) window.location.href = `/manhwa/${slug}`;
  };

  if (resolvedUserId === null) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Aucun utilisateur sélectionné.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Profile Section */}
      <Box sx={{ mb: 4 }}>
        {loadingProfile ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={28} />
          </Box>
        ) : profileError ? (
          <Typography color="error" textAlign="center" py={4}>{profileError}</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar 
                src={profile?.avatar_url || '/placeholder-avatar.png'} 
                alt={profile?.username || 'User'} 
                sx={{ width: 120, height: 120 }} 
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {profile?.username || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip label={`Total: ${stats.total}`} color="success" />
            {/*   <Chip label={`Reading: ${stats.reading}`} color="warning" /> */}
            {/*   <Chip label={`Completed: ${stats.completed}`} color="success" /> */}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Library Section */}
      <Box>
        {loadingLibrary ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : libraryError ? (
          <Typography color="error" textAlign="center" py={4}>{libraryError}</Typography>
        ) : library.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center" py={8}>
            No Manhwa found in this user's library.
          </Typography>
        ) : (
          <>
            <Grid container spacing={2} justifyContent="flex-start">
              {library.map((m) => (
                <Grid 
                  item 
                  key={getField(m, 'id') || getField(m, 'slug')} 
                  xs={6} 
                  sm={4} 
                  md={3} 
                  lg={2.4} 
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <CardManhwa manhwa={m} onClick={handleOpenManhwa} />
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
    </Box>
  );
}