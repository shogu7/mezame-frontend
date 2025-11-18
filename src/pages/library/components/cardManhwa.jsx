import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Chip, Stack } from '@mui/material';

export function CardManhwa({ manhwa, onClick }) {
  const title = manhwa.title || manhwa.name || 'Untitled';
  const cover = manhwa.cover_public_id
    ? `https://res.cloudinary.com/degc8d4er/image/upload/c_fill,g_auto,w_500,h_700/${manhwa.cover_public_id}.webp`
    : manhwa.cover_url || '/placeholder-300x450.png';

  const status = manhwa.status || 'Ongoing';
  const totalChapters = manhwa.totalChapters || manhwa.total_chapters || 0;

  return (
    <Card
      sx={{
        width: 200,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 3,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
      onClick={() => onClick && onClick(manhwa)}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          image={cover}
          alt={title}
          sx={{
            width: '100%',
            height: 280,
            objectFit: 'cover',
          }}
        />

        <CardContent sx={{ p: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
              height: 40,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={title}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
            <Chip label={status} size="small" />
            {totalChapters > 0 && (
              <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                {totalChapters} chapters
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

CardManhwa.propTypes = {
  manhwa: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default CardManhwa;
