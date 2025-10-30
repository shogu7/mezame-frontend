import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Skeleton,
  Button,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function LatestManhwaList({ 
  limit = 6, 
  fetchUrl = `http://localhost:4000/api/manhwa/latest?limit=` 
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `${fetchUrl}${limit}`;
        console.log('🚀 Fetching from:', url);
        
        const res = await fetch(url);
        console.log('📡 Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        console.log('📦 Received data:', json);
        console.log('📦 Type:', typeof json);
        console.log('📦 Is array?', Array.isArray(json));
        
        let itemsToSet = [];
        if (Array.isArray(json)) {
          itemsToSet = json;
        } else if (json.items && Array.isArray(json.items)) {
          itemsToSet = json.items;
        } else if (json.manhwa && Array.isArray(json.manhwa)) {
          itemsToSet = json.manhwa;
        }
        
        console.log('✅ Setting items:', itemsToSet.length, 'items');
        console.log('🔍 First item:', itemsToSet[0]);
        
        if (mounted) setItems(itemsToSet);
      } catch (err) {
        console.error("❌ LatestManhwaList fetch error:", err);
        if (mounted) {
          setItems([]);
          setError(err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [limit, fetchUrl]);

  const cardSx = {
    borderRadius: 2,
    boxShadow: 2,
    transition: "transform 200ms, box-shadow 200ms",
    '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
    background: theme.palette.background.paper,
  };

  const titleSx = { fontWeight: 700, color: theme.palette.text.primary };
  const subtitleSx = { color: theme.palette.text.secondary };
  const descriptionSx = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
    fontSize: '0.95rem'
  };

  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {Array.from({ length: limit }).map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <Card sx={cardSx}>
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton width="60%" height={28} />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="error" gutterBottom>
          Erreur de chargement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          Aucun manhwa trouvé. Soyez le premier à en ajouter.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {items.map((m) => (
        <Grid item xs={12} sm={6} md={4} key={m.manhwa_id}>
          <Card sx={cardSx}>
            <CardActionArea href={`/manhwa/${m.manhwa_id}`} sx={{ display: 'block', textAlign: 'left' }}>
              {m.cover_url ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={m.cover_url}
                  alt={m.title}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    px: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {m.title}
                  </Typography>
                </Box>
              )}

              <CardContent>
                <Typography variant="h6" sx={titleSx} gutterBottom noWrap>
                  {m.title}
                </Typography>

                {m.original_title && (
                  <Typography variant="body2" sx={subtitleSx} noWrap>
                    {m.original_title}
                  </Typography>
                )}

                {m.description && (
                  <Typography variant="body2" sx={{ ...descriptionSx, mt: 1 }}>
                    {m.description}
                  </Typography>
                )}

                <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    {m.total_chapters && (
                      <Chip
                        label={`${m.total_chapters} chap.`}
                        size="small"
                        sx={{ mr: 1, bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText }}
                      />
                    )}
                    {m.total_seasons && (
                      <Chip
                        label={`S${m.total_seasons}`}
                        size="small"
                        sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }}
                      />
                    )}
                  </Box>

                  <Button
                    size="small"
                    endIcon={<ArrowForwardIosIcon fontSize="small" />}
                    sx={{ textTransform: 'none' }}
                    href={`/manhwa/${m.manhwa_id}`}
                  >
                    Voir
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}