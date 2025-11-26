import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import IsConnected from '../../../features/auth/components/isConnected';
import { useAuth } from '../../../shared/context/authContext';
import { useUserProfile } from './hooks/useUserProfile';
import ProfilePageUI from './components/ProfilePageUI';

export default function ProfilePage() {
  const { userId: paramUserId } = useParams();
  const { user: authUser } = useAuth();

  const { 
    loadingProfile,
    authUser: hookAuthUser, 
    ...hookProps 
  } = useUserProfile(paramUserId);

  if (!hookAuthUser && !paramUserId && !loadingProfile) {
    return (
      <Box sx={{ mt: 3 }}>
        <IsConnected user={authUser} />
      </Box>
    );
  }

  return (
    <ProfilePageUI
      {...hookProps}
    />
  );
}