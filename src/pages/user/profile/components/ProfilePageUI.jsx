import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Pagination,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import CardManhwa from '../../collection/manhwaCard';
import { getField } from '../../collection/hook/getField';

export default function ProfilePageUI({
  profile,
  loadingProfile,
  profileError,
  library,
  loadingLibrary,
  libraryError,
  stats,
  isOwnProfile,
  page,
  totalPages,
  handlePageChange,
}) {
    
  const handleOpenManhwa = (m) => {
    const slug = getField(m, 'slug') || getField(m, 'id');
    if (slug) window.location.href = `/manhwa/${slug}`;
  };

  const pinnedManhwa = profile?.pinnedManhwa || [];
  const hasPinnedManhwa = Array.isArray(pinnedManhwa) && pinnedManhwa.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      
      {/* SECTION PROFIL */}
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
                {/* EDIT button */}
                {isOwnProfile && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                      variant="contained"
                      onClick={() => window.location.href = '/editprofile'}
                      sx={{
                        backgroundColor: '#36686fff',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#26c6da',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* USER bio */}
            {profile?.bio ? (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', opacity: 0.9 }}
                >
                  {profile.bio}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No bio yet
              </Typography>
            )}

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip label={`Total: ${stats.total}`} color="success" />
              <Chip label={`Reading: ${stats.reading}`} color="info" />
              <Chip label={`Completed: ${stats.completed}`} color="secondary" />
            </Stack>
          </Box>
        )}
      </Box>

      {/* MANHWAS pinned */}
      {hasPinnedManhwa && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Pinned Manhwa
          </Typography>
          <Grid container spacing={2} justifyContent="flex-start">
            {pinnedManhwa.map((m) => (
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
          <Divider sx={{ mt: 4 }} />
        </Box>
      )}

      {/* SECTION library */}
      <Box sx={{ mt: hasPinnedManhwa ? 4 : 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Library
        </Typography>
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
                  onChange={handlePageChange}
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