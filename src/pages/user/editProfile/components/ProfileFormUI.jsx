import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Stack,
  Alert,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';

export default function ProfileFormUI({
  profile,
  saving,
  error,
  avatarPreview,
  availableManhwa,
  loadingManhwa,
  handleChange,
  handleAvatarChange,
  handlePinnedManhwaChange,
  removePinnedManhwa,
  handleSave,
}) {

  return (
    <Box 
      sx={{ 
        maxWidth: 480, 
        mx:'auto', 
        px: 3, 
        width: '100%'
      }}
    >
      <Typography 
        variant="h5" 
        component="h1"
        mb={5} 
        sx={{ 
          color: '#fff', 
          fontWeight: 300,
          fontSize: '1.5rem',
          letterSpacing: '0.05em',
        }}
      >
        Edit Profile
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(211, 47, 47, 0.1)', 
            color: '#f44336',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            borderRadius: 1,
            '& .MuiAlert-icon': { color: '#f44336' }
          }}
        >
          {error}
        </Alert>
      )}

      <Stack spacing={4}>
        
        <Box sx={{ 
          display:'flex', 
          justifyContent: 'center',
          position: 'relative',
          mb: 2
        }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={avatarPreview || '/placeholder-avatar.png'} 
              sx={{ 
                width: 120, 
                height: 120,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }} 
            />
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#fff',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              <CameraAltIcon sx={{ fontSize: 18 }} />
              <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
            </IconButton>
          </Box>
        </Box>

        <TextField 
          label="Username" 
          name="username" 
          value={profile.username} 
          onChange={handleChange} 
          fullWidth 
          variant="standard"
          sx={{
            '& .MuiInputLabel-root': { 
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.875rem',
              '&.Mui-focused': { color: '#fff' }
            },
            '& .MuiInput-root': {
              color: '#fff',
              fontSize: '1rem',
              '&:before': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
              '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
              '&:after': { borderBottom: '1px solid #fff' },
            },
            '& .MuiInput-input': {
              py: 1.5
            }
          }}
        />

        <TextField 
          label="Bio" 
          name="bio" 
          value={profile.bio} 
          onChange={handleChange} 
          fullWidth 
          multiline 
          rows={4} 
          variant="standard"
          placeholder="Tell us about yourself..."
          sx={{
            '& .MuiInputLabel-root': { 
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.875rem',
              '&.Mui-focused': { color: '#fff' }
            },
            '& .MuiInput-root': {
              color: '#fff',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              '&:before': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
              '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
              '&:after': { borderBottom: '1px solid #fff' },
            },
            '& .MuiInput-input': {
              py: 1.5
            }
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              mb: 2,
              fontSize: '0.875rem' 
            }}
          >
            Pin your favorite manhwa (max 6)
          </Typography>

          {profile.pinnedManhwa && profile.pinnedManhwa.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.pinnedManhwa.map((manhwa) => (
                <Chip
                  key={manhwa.id}
                  label={manhwa.title}
                  onDelete={() => removePinnedManhwa(manhwa)}
                  deleteIcon={<CloseIcon sx={{ color: 'rgba(255, 255, 255, 0.7) !important' }} />}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                />
              ))}
            </Box>
          )}

          <Autocomplete
            multiple
            id="pinned-manhwa-autocomplete"
            options={availableManhwa}
            value={profile.pinnedManhwa || []}
            onChange={handlePinnedManhwaChange}
            getOptionLabel={(option) => option.title || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loadingManhwa}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Search your library..."
                sx={{
                  '& .MuiInputLabel-root': { 
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem',
                  },
                  '& .MuiInput-root': {
                    color: '#fff',
                    '&:before': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
                    '&:after': { borderBottom: '1px solid #fff' },
                  },
                  '& .MuiAutocomplete-input': {
                    color: '#fff',
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingManhwa ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  bgcolor: '#1a1a1a !important',
                  color: '#fff !important',
                  '&:hover': {
                    bgcolor: '#2a2a2a !important',
                  },
                  '&[aria-selected="true"]': {
                    bgcolor: '#333 !important',
                  }
                }}
              >
                {option.title}
              </Box>
            )}
            sx={{
              '& .MuiAutocomplete-popupIndicator': { color: 'rgba(255, 255, 255, 0.5)' },
              '& .MuiAutocomplete-clearIndicator': { color: 'rgba(255, 255, 255, 0.5)' },
            }}
            PaperComponent={({ children }) => (
              <Box sx={{ bgcolor: '#1a1a1a', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {children}
              </Box>
            )}
          />
        </Box>

        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={saving}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 500,
            bgcolor: '#fff', 
            color: '#000',
            textTransform: 'none',
            borderRadius: 1,
            boxShadow: 'none',
            '&:hover': { 
              bgcolor: '#e0e0e0',
              boxShadow: 'none',
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {saving ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Save Changes'}
        </Button>
      </Stack>
    </Box>
  );
}