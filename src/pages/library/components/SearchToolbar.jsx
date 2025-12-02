import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Autocomplete,
} from '@mui/material';

export function SearchToolbarSite({ filters, onFiltersChange, allGenres = [], allAuthors = [] }) {
  const handle = (patch) => onFiltersChange({ ...filters, ...patch });

  const statusOptions = useMemo(() => ['Ongoing', 'Completed', 'Hiatus', 'Cancelled'], []);

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {/* Recherche par titre */}
        <TextField
          size="small"
          placeholder="Search by title..."
          value={filters.search || ''}
          onChange={(e) => handle({ search: e.target.value })}
          sx={{
            minWidth: 220,
            flex: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            input: { color: 'common.white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
          }}
        />

        <Autocomplete
          multiple
          size="small"
          options={allGenres}
          value={filters.genres || []}
          onChange={(_, value) => handle({ genres: value })}
          sx={{
            width: 240,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            input: { color: 'common.white' },
          }}
          renderInput={(params) => <TextField {...params} label="Genres" />}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="author-label" sx={{ color: 'common.white', '&.Mui-focused': { color: 'white' } }}>Author</InputLabel>
          <Select
            labelId="author-label"
            value={filters.author || ''}
            label="Author"
            onChange={(e) => handle({ author: e.target.value || null })}
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              color: 'common.white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <MenuItem value="">Any</MenuItem>
            {allAuthors.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label" sx={{ color: 'common.white' }}>Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filters.status || ''}
            label="Status"
            onChange={(e) => handle({ status: e.target.value })}
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              color: 'common.white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handle({ search: '', genres: [], author: null, status: '' })}
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.12)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

SearchToolbarSite.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  allGenres: PropTypes.array,
  allAuthors: PropTypes.array,
};

export default SearchToolbarSite;
