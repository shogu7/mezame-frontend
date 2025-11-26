import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Chip,
  Skeleton,
  useTheme,
  Fade,
} from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TvIcon from '@mui/icons-material/Tv';

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
        const res = await fetch(url);
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const json = await res.json();
        let itemsToSet = [];
        
        if (Array.isArray(json)) {
          itemsToSet = json;
        } else if (json.items && Array.isArray(json.items)) {
          itemsToSet = json.items;
        } else if (json.manhwa && Array.isArray(json.manhwa)) {
          itemsToSet = json.manhwa;
        }
        
        if (mounted) setItems(itemsToSet);
      } catch (err) {
        console.error("LatestManhwaList error:", err);
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
    height: '100%',
    width: '100%',
    aspectRatio: '500/700',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    '&:hover': { 
      transform: 'translateY(-6px)', 
      boxShadow: '0 12px 25px rgba(0,0,0,0.3)',
      '& .MuiCardMedia-root': {
        transform: 'scale(1.08)',
      },
      '& .card-overlay': {
         background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
      }
    },
  };

  const overlaySx = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    p: 2,
    transition: 'background 0.4s ease',
    zIndex: 2,
  };

  const badgeSx = {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: '#fff',
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.15)',
    height: 26,
    fontSize: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    '& .MuiChip-icon': { color: theme.palette.primary.light, fontSize: 15 }
  };

  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {Array.from({ length: limit }).map((_, i) => (
          <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
            <Skeleton 
              variant="rectangular" 
              sx={{ borderRadius: 3, aspectRatio: '500/700', height: 'auto' }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || !items.length) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color={error ? "error" : "text.secondary"}>
          {error ? "Erreur de chargement" : "Aucun manhwa trouvé"}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 1, px: 1 }}>
      {items.map((m) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={m.manhwa_id}>
          <Fade in={true} timeout={600}>
            <Card sx={cardSx}>
              <CardActionArea 
                href={`/manhwa/${m.manhwa_id}`} 
                sx={{ height: '100%', width: '100%' }}
              >
                {m.cover_url ? (
                  <CardMedia
                    component="img"
                    image={m.cover_url}
                    alt={m.title}
                    sx={{ 
                      height: '100%', 
                      width: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease' 
                    }}
                  />
                ) : (
                  <Box sx={{ height: '100%', bgcolor: 'grey.900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" color="grey.500">Sans Cover</Typography>
                  </Box>
                )}

                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.8, flexDirection: 'column', alignItems: 'flex-end', zIndex: 3 }}>
                  {m.total_seasons && (
                    <Chip
                      icon={<TvIcon />}
                      label={`Saison ${m.total_seasons}`}
                      size="small"
                      sx={badgeSx}
                    />
                  )}
                  {m.total_chapters && (
                    <Chip
                      icon={<AutoStoriesIcon />}
                      label={`${m.total_chapters} Ch.`}
                      size="small"
                      sx={badgeSx}
                    />
                  )}
                </Box>

                <Box className="card-overlay" sx={overlaySx}>
                  <Typography 
                    variant="subtitle1" 
                    component="h3"
                    sx={{ 
                      color: '#fff', 
                      fontWeight: 700, 
                      lineHeight: 1.3,
                      textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 0.5
                    }}
                  >
                    {m.title}
                  </Typography>
                  
                  {m.original_title && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.75)', 
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {m.original_title}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
}