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

export function SearchToolbar({ filters, onFiltersChange, allGenres = [], allAuthors = [] }) {
  const handle = (patch) => onFiltersChange({ ...filters, ...patch });

  const statusOptions = useMemo(() => ['reading', 'completed', 'plan_to_read', 'on_hold', 'dropped'], []);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search by title..."
          value={filters.search || ''}
          onChange={(e) => handle({ search: e.target.value })}
          sx={{ minWidth: 220, flex: 1 }}
        />

        <Autocomplete
          multiple
          size="small"
          options={allGenres}
          value={filters.genres || []}
          onChange={(_, value) => handle({ genres: value })}
          sx={{ width: 240 }}
          renderInput={(params) => <TextField {...params} label="Genres" />}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="author-label">Author</InputLabel>
          <Select
            labelId="author-label"
            value={filters.author || ''}
            label="Author"
            onChange={(e) => handle({ author: e.target.value || null })}
          >
            <MenuItem value="">Any</MenuItem>
            {allAuthors.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            value={filters.sort}
            label="Sort"
            onChange={(e) => handle({ sort: e.target.value })}
          >
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="Z-A">Z-A</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Recent">Recent</MenuItem>
            <MenuItem value="Chapters">Chapters</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={(filters.status && filters.status.length > 0) ? filters.status[0] : ''}
            label="Status"
            onChange={(e) => handle({ status: e.target.value ? [e.target.value] : [] })}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handle({ search: '', genres: [], author: null, sort: 'A-Z', status: [] })}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

SearchToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  allGenres: PropTypes.array,
  allAuthors: PropTypes.array,
};

export default SearchToolbar;
