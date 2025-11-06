import React from 'react';
import { Card, Typography, Stack, Box } from '@mui/material';
import { Star } from '@mui/icons-material';

export default function ManhwaStat({ isInLibrary, readingStatus, currentChapter, userRating, manhwa }) {
  const statusOptions = [
    { value: 'reading', label: 'Reading' },
    { value: 'completed', label: 'Completed' },
    { value: 'plan_to_read', label: 'Plan to Read' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' },
  ];

  return (
    <div>
      {isInLibrary && (
        <Card sx={{ bgcolor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 1.5, p: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Your Status</Typography>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Status</Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>{statusOptions.find(s => s.value === readingStatus)?.label || 'Plan to Read'}</Typography>
            </Box>
            {currentChapter !== '' && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Chapter</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>{currentChapter} / {manhwa.total_chapters || '?'}</Typography>
              </Box>
            )}
            {userRating !== '' && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Your Rating</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Star sx={{ color: '#FCD34D', fontSize: 16 }} />
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>{userRating}</Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </Card>
      )}

      <Stack direction="row" spacing={3}>
        <Box><Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Chapters</Typography><Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>{manhwa.total_chapters || '?'}</Typography></Box>
        <Box><Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Seasons</Typography><Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>{manhwa.total_seasons || 1}</Typography></Box>
        <Box><Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Release Date</Typography><Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>{manhwa.release_date ? new Date(manhwa.release_date).getFullYear() : 'N/A'}</Typography></Box>
      </Stack>
    </div>
  );
}
