import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';

const statusOptions = [
  { value: 'reading', label: 'Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'plan_to_read', label: 'Plan to Read' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' },
];

export default function LibraryDialog({
  open,
  onClose,
  isInLibrary,
  readingStatus,
  setReadingStatus,
  currentChapter,
  setCurrentChapter,
  userRating,
  setUserRating,
  saving,
  onSave,
  manhwa,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.03)' } }}
    >
      <DialogTitle sx={{ color: 'text.primary', fontWeight: 600 }}>
        {isInLibrary ? 'Edit Library Entry' : 'Add to Library'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={readingStatus}
              label="Status"
              onChange={(e) => setReadingStatus(e.target.value)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.06)' } }}
            >
              {statusOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          </FormControl>

          {['reading', 'on_hold'].includes(readingStatus) && (
            <TextField
              fullWidth
              label="Current Chapter"
              type="number"
              value={currentChapter}
              onChange={(e) => setCurrentChapter(e.target.value)}
              inputProps={{ min: 0, max: manhwa?.total_chapters }}
              helperText={`Total chapters: ${manhwa?.total_chapters || '?'}`}
            />
          )}

          <FormControl fullWidth>
            <InputLabel id="rating-label">Your Rating (Optional)</InputLabel>
            <Select
              labelId="rating-label"
              value={userRating}
              label="Your Rating (Optional)"
              onChange={(e) => setUserRating(e.target.value)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.06)' } }}
            >
              <MenuItem value="">None</MenuItem>
              {[10,9,8,7,6,5,4,3,2,1].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={onSave} disabled={saving} variant="contained" sx={{ bgcolor: 'primary.main', color: '#fff', textTransform: 'none', px: 3, '&:hover': { bgcolor: 'primary.dark' } }}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
