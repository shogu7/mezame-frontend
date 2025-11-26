import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, styled } from "@mui/material/styles";
import Footer from "../../shared/components/layout/Footer/footer.jsx";
import LatestManhwaList from "../../features/manhwa/components/Manhwa/lastedManhwa.jsx";
import { motion } from 'framer-motion';

const HeroGrid = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  pt: theme.spacing(20), 
  pb: theme.spacing(8),
  mb: theme.spacing(6),
  overflow: 'hidden',
  borderBottom: `1px solid ${theme.palette.divider}`,
  
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    background: 
      `repeating-linear-gradient(0deg, ${theme.palette.grey[800]}, ${theme.palette.grey[800]} 1px, transparent 1px, transparent 40px), 
       repeating-linear-gradient(90deg, ${theme.palette.grey[800]}, ${theme.palette.grey[800]} 1px, transparent 1px, transparent 40px)`,
    opacity: 0.2, 
    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)',
  },
}));

export default function WelcomePage() {
  const theme = useTheme();

  const mainTitleColor = theme.palette.common.white;
  const accentColor = theme.palette.primary.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.background.default, 
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          
          <HeroGrid>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontFamily: 'monospace, sans-serif', 
                  fontWeight: 600, 
                  fontSize: { xs: "2.5rem", md: "5rem" },
                  lineHeight: 1,
                  pt: 5,
                  color: mainTitleColor,
                  textShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}80`, 
                }}
              >
                Mezame
              </Typography>
            </motion.div>

            <Typography
              variant="h5"
              color="text.secondary" 
              sx={{ 
                maxWidth: 800, 
                mx: "auto", 
                fontWeight: 400,
                mt: 4,
                fontSize: { xs: "1.25rem", md: "1.6rem" },
                position: 'relative', 
                zIndex: 1,
                letterSpacing: '0.05em'
              }}
            >
            Track the newest manhwa additions, continuously updated by our community.
            </Typography>
          </HeroGrid>

          <Box sx={{ mb: 8, mt: 4 }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 700, 
                mb: 4,
                borderLeft: `5px solid ${accentColor}`,
                pl: 2.5,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: mainTitleColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
            New Releases
            </Typography>

            <LatestManhwaList limit={18} />
          </Box>
        </Container>

        <Footer />
      </Box>
    </motion.div>
  );
}