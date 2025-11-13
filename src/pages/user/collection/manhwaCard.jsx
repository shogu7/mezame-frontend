import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { MenuBook, Star } from '@mui/icons-material';
import { getField } from './getField';

export function ManhwaCard({ manhwa, onContinue }) {
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
  const displayCurrent = totalChapters == null ? 0 : currentChapter;
  const progressValue = displayTotal > 0 ? Math.min(100, Math.round((displayCurrent / displayTotal) * 100)) : 0;

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
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'stretch',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <CardActionArea
        onClick={handleOpenManhwa}
        onDoubleClick={handleContinue}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'stretch',
          flex: 1,
          textAlign: 'left',
        }}
      >
        {/* Image */}
        <Box
          sx={{
            width: { xs: '100%', sm: 140 },
            minWidth: { sm: 140 },
            paddingTop: { xs: '140%', sm: 0 },
            backgroundImage: `url(${cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
          }}
        />

        {/* Contenu */}
        <CardContent sx={{ flex: 1, py: 1, px: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: 1.3,
              height: '2.6em',
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
                {displayCurrent} / {displayTotal}
              </Typography>
            </Stack>
            {rating != null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Star sx={{ fontSize: 14 }} />
                <Typography variant="caption">{rating}</Typography>
              </Stack>
            )}
          </Stack>

          {/* Barre de progression */}
          <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
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

export default ManhwaCard;
