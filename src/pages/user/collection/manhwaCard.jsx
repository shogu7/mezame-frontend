import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { MenuBook, Star } from '@mui/icons-material';
import { getField } from './hook/getField';

export default function ManhwaCard({ manhwa, onContinue }) {
  const title = getField(manhwa, 'title', 'name') || 'Untitled';
  const cover = getField(manhwa, 'coverUrl', 'cover_url', 'cover') || '/placeholder-300x450.png';

  const displayStatus =
    manhwa.displayStatus ||
    getField(manhwa, 'displayStatus') ||
    formatStatusFallback(getField(manhwa, 'userStatus', 'status', 'personal_status', ''));

  const currentChapter = getField(manhwa, 'currentChapter', 'current_chapter') ?? 0;
  const totalChapters = getField(manhwa, 'totalChapters', 'total_chapters') ?? null;
  const rating = getField(manhwa, 'rating', 'note') ?? null;

  const handleContinue = (e) => {
    e.stopPropagation();
    if (typeof onContinue === 'function') onContinue(manhwa);
  };

  const displayTotal = totalChapters == null ? 0 : totalChapters;
  let displayCurrent = totalChapters == null ? 0 : currentChapter;
  let progressValue = displayTotal > 0 ? Math.min(100, Math.round((displayCurrent / displayTotal) * 100)) : 0;

  if (displayStatus?.toLowerCase() === 'completed' && displayTotal > 0) {
    displayCurrent = displayTotal;
    progressValue = 100;
  }

  const slug =
    getField(manhwa, 'slug', 'slugified', 'slugify') ||
    getField(manhwa, 'id', 'manhwa_id', 'manhwaId') ||
    null;

  const handleOpenManhwa = () => {
    if (!slug) return;
    window.location.href = `/manhwa/${slug}`;
  };

  return (
    <Card
      elevation={1}
      sx={{
        width: { xs: 160, sm: 200, md: 220 },
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        onClick={handleOpenManhwa}
        onDoubleClick={handleContinue}
        sx={{ display: 'block' }}
      >
        <Box sx={{ width: '100%' }}>
          <CardMedia
            component="img"
            image={cover}
            alt={title}
            sx={{
              width: '100%',
              aspectRatio: '5/7',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>

        <CardContent sx={{ p: 1.25 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: 1.2,
              height: '2.4em',
            }}
            title={title}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            {displayStatus && <Chip label={displayStatus} size="small" />}

            <Stack direction="row" spacing={0.5} alignItems="center">
              <MenuBook fontSize="small" />
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                {displayCurrent} / {displayTotal || '?'}
              </Typography>
            </Stack>

            {rating != null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Star sx={{ fontSize: 14 }} />
                <Typography variant="caption">{rating}</Typography>
              </Stack>
            )}
          </Stack>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(3, 246, 254, 0.08)' : theme.palette.action.hover,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'rgba(1, 144, 149, 0.64)',
                  },
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right' }}>
              {progressValue}%
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function formatStatusFallback(status) {
  if (!status && status !== 0) return '';
  return String(status)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

ManhwaCard.propTypes = {
  manhwa: PropTypes.object.isRequired,
  onContinue: PropTypes.func,
};
