import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material';

import ManhwaInfo from './components/ManhwaInfo';
import ManhwaStat from './components/ManhwaStats';
import LibraryDialog from './components/LibraryDialog';
import LibrarySnackbar from './components/LibrarySnackbar';
import BackButton from '../../shared/components/buttons/BackButton'

import useSnackbar from './hooks/useSnackbar';
import useLibraryStatus from './hooks/useLibraryStatus';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

export default function ManhwaPage() {
  const { id } = useParams();
  const [manhwa, setManhwa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { snackbar, showMessage, closeSnackbar } = useSnackbar();

  const {
    isInLibrary,
    readingStatus,
    setReadingStatus,
    currentChapter,
    setCurrentChapter,
    userRating,
    setUserRating,
    saving,
    checkLibraryStatus,
    saveToLibrary,
  } = useLibraryStatus(showMessage);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}manhwa/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }
        const data = await res.json();
        if (!mounted) return;
        if (data.ok) {
          setManhwa(data.manhwa);
          setError('');
          await checkLibraryStatus(data.manhwa.manhwa_id);
        } else {
          setManhwa(null);
          setError(data.error || 'Manhwa not found');
        }
      } catch (err) {
        if (!mounted) return;
        setManhwa(null);
        setError('Fetch error: ' + err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, checkLibraryStatus]);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSave = async () => {
    if (!manhwa) return;
    await saveToLibrary(
      {
        manhwa_id: manhwa.manhwa_id,
        status: readingStatus,
        current_chapter: currentChapter === '' ? 0 : Number(currentChapter),
        rating: userRating === '' ? null : Number(userRating),
      },
      () => {
        handleCloseDialog();
      }
    );
  };

  const handleShare = () => {
    if (navigator.share && manhwa) {
      navigator.share({
        title: manhwa.title,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 3, md: 6 } }}>
        <BackButton />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 1.5 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 3, borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 3, md: 6 } }}>
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
      </Container>
    );
  }

  if (!manhwa) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 3, md: 6 } }}>
        <Alert severity="warning" sx={{ borderRadius: 1.5 }}>Manhwa not found</Alert>
      </Container>
    );
  }

  const genres = Array.isArray(manhwa.genres)
    ? manhwa.genres
    : typeof manhwa.genres === 'string'
      ? manhwa.genres.split(',').map(g => g.trim())
      : ['Aucun genre...'];

  const rating = manhwa.rating || 4.5;

  const coverUrl = manhwa.cover_public_id
    ? `https://res.cloudinary.com/degc8d4er/image/upload/c_fill,g_auto,w_500,h_750/${manhwa.cover_public_id}.webp`
    : manhwa.cover_url;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 3, md: 6 } }}>
        <BackButton /> 
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 1.5, overflow: 'hidden', boxShadow: 1, border: '1px solid rgba(255,255,255,0.03)' }}>
              <CardMedia
                component="img"
                image={coverUrl}
                alt={manhwa.title}
                sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <ManhwaInfo
              manhwa={manhwa}
              genres={genres}
              rating={rating}
              isInLibrary={isInLibrary}
              onOpenDialog={handleOpenDialog}
              onShare={handleShare}
            />

            <ManhwaStat
              isInLibrary={isInLibrary}
              readingStatus={readingStatus}
              currentChapter={currentChapter}
              userRating={userRating}
              manhwa={manhwa}
            />
          </Grid>
        </Grid>

        <Card sx={{ bgcolor: 'background.paper', borderRadius: 1.5, boxShadow: 1, border: '1px solid rgba(255,255,255,0.03)', p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>Synopsis</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            {manhwa.description || 'No description available.'}
          </Typography>
        </Card>

        <Card sx={{ bgcolor: 'background.paper', borderRadius: 1.5, boxShadow: 1, border: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}>Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Original Title</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {manhwa.original_title || manhwa.title}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Type</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>Manhwa</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Status</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {manhwa.status || 'Ongoing'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Release Date</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {manhwa.release_date ? new Date(manhwa.release_date).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <LibraryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        isInLibrary={isInLibrary}
        readingStatus={readingStatus}
        setReadingStatus={setReadingStatus}
        currentChapter={currentChapter}
        setCurrentChapter={setCurrentChapter}
        userRating={userRating}
        setUserRating={setUserRating}
        saving={saving}
        onSave={handleSave}
        manhwa={manhwa}
      />

      <LibrarySnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
