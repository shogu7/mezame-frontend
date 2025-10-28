import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Footer from "../components/footer.jsx";
import LatestManhwaList from "../components/display/lastedManhwa.jsx";

export default function WelcomePage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: 
          theme.palette.mode === "light",
      }}
    >

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flexGrow: 1 }}>
        <Box sx={{ textAlign: "center", mb: 6, px: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: theme.palette.text.primary,
              fontSize: { xs: "2.25rem", md: "3rem" },
            }}
          >
            Mezamze
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 780, mx: "auto", fontWeight: 500 }}
          >
            Discover and track the latest manhwa — updated continuously by our community.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Newly added
          </Typography>

          <LatestManhwaList limit={6} />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
