import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import { BookmarkAdd, BookmarkRemove, MenuBook, Star } from '@mui/icons-material';
import { getField } from './getField';

export function ManhwaCard({ manhwa, onFollowToggle, onContinue }) {
  const id = getField(manhwa, 'id', 'manhwa_id', 'manhwaId', 'slug'); // slug : indefined rn
  const title = getField(manhwa, 'title', 'name') || 'Untitled';
  const cover = getField(manhwa, 'coverUrl', 'cover_url', 'cover') || '/placeholder-300x450.png';
  const status = getField(manhwa, 'userStatus', 'status', 'personal_status') || null;
  const currentChapter = getField(manhwa, 'currentChapter', 'current_chapter') ?? 0;
  const totalChapters = getField(manhwa, 'totalChapters', 'total_chapters') ?? null;
  const rating = getField(manhwa, 'rating', 'note') ?? null;
  const isFollowing = Boolean(getField(manhwa, 'isFollowing', 'is_following') || manhwa.is_following);

  const handleFollowClick = (e) => {
    e.stopPropagation();
    if (typeof onFollowToggle === 'function') onFollowToggle(manhwa);
  };

  const handleContinue = (e) => {
    e.stopPropagation();
    if (typeof onContinue === 'function') onContinue(manhwa);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      <CardActionArea
        onDoubleClick={handleContinue}
        sx={{ alignItems: 'stretch', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}
      >
      <CardMedia
        component="div"
        sx={{
          width: '100%',
          paddingTop: '150%',
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

        <CardContent sx={{ pb: 1, pt: 1 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, mb: 0.5 }}>
            {status && <Chip label={String(status)} size="small" />}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MenuBook fontSize="small" />
              <Typography variant="caption">
                {currentChapter ?? 0}{totalChapters ? ` / ${totalChapters}` : ''}
              </Typography>
            </Stack>
            {rating != null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Star sx={{ fontSize: 14 }} />
                <Typography variant="caption">{rating}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>

      <Box sx={{ px: 1, py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          #{id}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title={isFollowing ? 'Unfollow' : 'Follow'}>
            <IconButton size="small" onClick={handleFollowClick} aria-label={isFollowing ? 'Unfollow' : 'Follow'}>
              {isFollowing ? <BookmarkRemove /> : <BookmarkAdd />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Card>
  );
}

ManhwaCard.propTypes = {
  manhwa: PropTypes.object.isRequired,
  onFollowToggle: PropTypes.func,
  onContinue: PropTypes.func,
};

export default ManhwaCard;
