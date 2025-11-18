import React from 'react';
import { Box, Avatar, Typography, Stack, Button } from '@mui/material';
import { useAuth } from '../../../../shared/context/authContext';

const avatarFallback = '/placeholder-avatar.png';

export default function ProfileHeader({ user }) {
  const { user: currentUser } = useAuth();

  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : null;
  const isOwner = currentUser && (currentUser.username === user.username || currentUser.user_id === user.user_id);

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        <Avatar
          src={user.avatar_url || avatarFallback}
          alt={user.username}
          sx={{ width: 96, height: 96, borderRadius: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{user.username}</Typography>
            {isOwner && (
              <Button
                variant="outlined"
                size="small"
                href="/profile/edit"
                sx={{ textTransform: 'none' }}
              >
                Edit profile
              </Button>
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Joined {createdAt || '—'}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
