import React from 'react';
import { Box, Grid, Typography, FormControl, Select, MenuItem, Button, Pagination } from '@mui/material';
import { useLibrary } from './useLibrary';
import { ManhwaCard } from './manhwaCard';
import { SearchToolbar } from './SearchToolbar';
import { getField } from './getField';

export function UserCollection() {
  const {
    manhwaList,
    // allManhwa, never used
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
    toggleFollow,
  } = useLibrary();

  const handleContinue = (m) => {
    console.log('continue', getField(m, 'slug') || getField(m, 'id'));
  };

  if (loading) {
    return <Typography color="text.secondary">Loading...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, letterSpacing: '-0.2px' }}>
          My Collection
        </Typography>

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
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {manhwaList.length > 0 ? (
          <Grid container spacing={3}>
            {manhwaList.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={getField(m, 'id') || getField(m, 'slug')}>
                <ManhwaCard
                  manhwa={m}
                  onFollowToggle={toggleFollow}
                  onContinue={handleContinue}
                />
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
