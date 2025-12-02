import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import PanelAdmin from '../components/PanelAdmin.jsx';
import PanelAdminManhwa from '../components/PanelAdminManhwa.jsx';

export default function AdminPanelTabs() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', my: 4, px: 2 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
          color: 'common.white',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Utilisateurs" />
          <Tab label="Manhwa" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Gestion des utilisateurs</Typography>
              <PanelAdmin />
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Gestion des manhwa</Typography>
              <PanelAdminManhwa />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
