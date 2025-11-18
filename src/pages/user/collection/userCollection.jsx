import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Button
} from '@mui/material';
import { useLibrary } from './hook/useLibrary';
import CardManhwa from './manhwaCard';
import { SearchToolbar } from './SearchToolbar';
import { getField } from './hook/getField';

export function UserCollection() {
  const {
    manhwaList,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    allGenres,
    allAuthors,
  } = useLibrary();

  const handleOpenManhwa = (m) => {
    const slug = getField(m, 'slug') || getField(m, 'id');
    if (slug) window.location.href = `/manhwa/${slug}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
        <CircularProgress size={32} />
        <Typography variant="body1" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          My Collection
        </Typography>

        {/* Search / Filters Toolbar */}
        <SearchToolbar
          filters={filters}
          onFiltersChange={setFilters}
          allGenres={allGenres}
          allAuthors={allAuthors}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {manhwaList.length} result{manhwaList.length !== 1 ? 's' : ''}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {manhwaList.length > 0 ? (
          <Grid container spacing={2} justifyContent="flex-start">
            {manhwaList.map((m) => (
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
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
              No manhwa found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or search terms
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                setFilters({ search: '', genres: [], author: null, sort: 'A-Z', status: [] })
              }
              sx={{ bgcolor: 'primary.main', color: '#fff' }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default UserCollection;
