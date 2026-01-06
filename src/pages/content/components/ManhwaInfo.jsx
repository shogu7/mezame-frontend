import React from 'react';
import {
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import { Share, Star, BookmarkAdd, Edit, Delete } from '@mui/icons-material';

export default function ManhwaInfo({
  manhwa,
  genres,
  rating,
  isInLibrary,
  onOpenDialog,
  onShare,
  saveToLibrary,
  saving,
  showMessage,
  onRemoveFromLibrary,
}) {
  return (
    <div>
      <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 600, color: 'text.primary', mb: 2, letterSpacing: '-0.2px' }}>
        {manhwa.title}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Chip label={manhwa.status || 'Ongoing'} size="small" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 500 }} />
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Star sx={{ color: '#FCD34D', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>{rating}</Typography>
        </Stack>
        {manhwa.author && <Typography variant="body2" sx={{ color: 'text.secondary' }}>by {manhwa.author}</Typography>}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {genres.map((genre, idx) => <Chip key={idx} label={genre} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }} />)}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {/* Bouton add / edit */}
        <Button
          variant="contained"
          startIcon={isInLibrary ? <Edit /> : <BookmarkAdd />}
          onClick={(e) => { e.currentTarget.blur(); onOpenDialog(); }}
          sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: 1, px: 2.5, py: 1.25, '&:hover': { bgcolor: 'primary.dark' } }}
          aria-label={isInLibrary ? 'Edit library entry' : 'Add to library'}
        >
          {isInLibrary ? 'Edit' : 'Add to Library'}
        </Button>

        {/* BOUTON DELETE — use prop onRemoveFromLibrary from ManhwaPage */}
        {isInLibrary && onRemoveFromLibrary && (
          <Button
            variant="outlined"
            startIcon={<Delete />}
            onClick={onRemoveFromLibrary}
            disabled={saving}
            sx={{ borderColor: 'rgba(255,255,255,0.06)', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
          >
            Remove from the profil
          </Button>
        )}

        <IconButton
          onClick={onShare}
          sx={{ border: '1px solid rgba(255,255,255,0.06)', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.12)' } }}
          aria-label="Share"
        >
          <Share />
        </IconButton>
      </Stack>
    </div>
  );
}
